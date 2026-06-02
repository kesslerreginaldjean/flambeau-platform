import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../lib/env';

export type Role = 'admin' | 'teacher' | 'parent' | 'student';

export interface AuthUser {
  userId: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

/**
 * Verify JWT. Sets `req.user` on success, 401 on failure.
 * Audit P0-2: secret comes from validated env, no `dev-secret` fallback.
 */
export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401).json({ message: 'Jeton d’authentification manquant.' });
    return;
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthUser;
    if (!payload?.userId || !payload?.role) {
      res.status(401).json({ message: 'Jeton invalide.' });
      return;
    }
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Jeton invalide ou expiré.' });
  }
};

/**
 * Restrict access to a set of roles. Must be used AFTER verifyToken.
 * Audit P0-3.
 */
export const requireRole = (...roles: Role[]) =>
  (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Authentification requise.' });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Accès refusé : privilèges insuffisants.' });
      return;
    }
    next();
  };

/**
 * Allow access only if the URL param `:id` matches the JWT userId,
 * OR the caller has one of the allowed override roles (typically admin).
 * Audit P0-3: closes IDOR on /api/students/:id/*, /api/parents/:id/*.
 */
export const requireSelfOrRole = (paramName = 'id', ...overrideRoles: Role[]) =>
  (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Authentification requise.' });
      return;
    }
    const paramValue = req.params[paramName];
    if (req.user.userId === paramValue) return next();
    if (overrideRoles.includes(req.user.role)) return next();
    res.status(403).json({ message: 'Accès refusé.' });
  };

