/**
 * Protected /uploads handler.
 *
 * Replaces `express.static('/uploads', ...)` so we can enforce auth and ACL on
 * sensitive files (birth certificates, identity photos, medical certificates,
 * report cards of minors).
 *
 * Audit reference: P0-7.
 *
 * Rules:
 *  - /uploads/admissions/*  -> admin only.
 *  - /uploads/students/<userId>/*  -> the student themselves, their parent, admin or any teacher.
 *  - Everything else      -> 403 by default.
 *
 * No directory traversal: we resolve the path and ensure it stays under uploadsRoot.
 */

import path from 'path';
import fs from 'fs';
import { Response, NextFunction } from 'express';
import { AuthRequest, verifyToken } from './auth';
import prisma from '../lib/prisma';

const uploadsRoot = path.resolve(__dirname, '../../uploads');

function safeJoin(reqPath: string): string | null {
  // Reject embedded null bytes and absolute paths.
  if (reqPath.includes('\0')) return null;
  const decoded = decodeURIComponent(reqPath).replace(/\\/g, '/');
  const target = path.resolve(uploadsRoot, '.' + (decoded.startsWith('/') ? decoded : '/' + decoded));
  // Confined under root?
  if (!target.startsWith(uploadsRoot + path.sep) && target !== uploadsRoot) return null;
  return target;
}

async function canAccess(req: AuthRequest, relative: string): Promise<boolean> {
  const user = req.user;
  if (!user) return false;

  // /admissions/* — admin only.
  if (relative.startsWith('/admissions/') || relative.startsWith('admissions/')) {
    return user.role === 'admin';
  }

  // /students/<userId>/<file>
  const m = relative.match(/^\/?students\/([^/]+)\/.+/);
  if (m) {
    const targetUserId = m[1];
    if (user.role === 'admin' || user.role === 'teacher') return true;
    if (user.userId === targetUserId) return true;
    if (user.role === 'parent') {
      // Parent can access files of their linked children.
      const parent = await prisma.parent.findUnique({ where: { userId: user.userId } });
      if (!parent) return false;
      const child = await prisma.student.findFirst({ where: { userId: targetUserId, parentId: parent.id } });
      return !!child;
    }
    return false;
  }

  // Default deny.
  return false;
}

export function uploadsHandler(req: AuthRequest, res: Response, next: NextFunction) {
  // Run JWT verification first; reuse the existing middleware.
  verifyToken(req, res, async (err?: any) => {
    if (err) return; // verifyToken already sent the response
    if (!req.user) return; // already 401'd

    try {
      const rel = req.path; // e.g. "/admissions/birthCertificate-xxx.pdf"
      const fileAbs = safeJoin(rel);
      if (!fileAbs) return res.status(400).json({ message: 'Chemin invalide.' });

      const allowed = await canAccess(req, rel);
      if (!allowed) return res.status(403).json({ message: 'Accès refusé.' });

      if (!fs.existsSync(fileAbs)) return res.status(404).json({ message: 'Fichier introuvable.' });

      // Set conservative headers to avoid the browser previewing as HTML.
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Cache-Control', 'private, max-age=0, no-store');
      return res.sendFile(fileAbs);
    } catch (e) {
      console.error('[uploads] error:', e);
      return res.status(500).json({ message: 'Erreur serveur.' });
    }
  });
  // Silence unused warning
  void next;
}
