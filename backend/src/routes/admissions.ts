import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import prisma from '../lib/prisma';
import { verifyToken, requireRole } from '../middleware/auth';
import { validate, schemas } from '../middleware/validate';

const router = Router();

// Use crypto.randomBytes for unguessable filenames (audit fix).
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = 'uploads/admissions';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const safeExt = path.extname(file.originalname).toLowerCase().replace(/[^a-z0-9.]/g, '');
    const random = crypto.randomBytes(24).toString('hex');
    cb(null, `${file.fieldname}-${random}${safeExt}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedExt = /\.(jpe?g|png|pdf)$/i;
    const allowedMime = /^(image\/jpe?g|image\/png|application\/pdf)$/i;
    if (allowedExt.test(file.originalname) && allowedMime.test(file.mimetype)) {
      return cb(null, true);
    }
    cb(new Error('Format de fichier non supporté (JPG, PNG, PDF uniquement).'));
  },
});

const uploadFields = upload.fields([
  { name: 'birthCertificate', maxCount: 1 },
  { name: 'reportCard', maxCount: 1 },
  { name: 'identityPhotos', maxCount: 1 },
  { name: 'medicalCertificate', maxCount: 1 },
]);

/**
 * POST /api/admissions
 * PUBLIC route — anyone can submit a candidature.
 * Rate-limited at the app level (helmet + express-rate-limit) — see index.ts.
 */
router.post('/', uploadFields, validate(schemas.admission), async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, level, message } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const admission = await prisma.admission.create({
      data: {
        studentFirstName: firstName,
        studentLastName: lastName,
        parentEmail: email,
        parentPhone: phone,
        level,
        notes: message,
        birthCertificateUrl: files['birthCertificate'] ? `/uploads/admissions/${files['birthCertificate'][0].filename}` : null,
        reportCardUrl: files['reportCard'] ? `/uploads/admissions/${files['reportCard'][0].filename}` : null,
        identityPhotosUrl: files['identityPhotos'] ? `/uploads/admissions/${files['identityPhotos'][0].filename}` : null,
        medicalCertificateUrl: files['medicalCertificate'] ? `/uploads/admissions/${files['medicalCertificate'][0].filename}` : null,
        status: 'NEW',
      },
    });

    // Return only the admission id — do not echo PII.
    return res.status(201).json({ message: 'Candidature reçue avec succès.', admissionId: admission.id });
  } catch (error: any) {
    console.error('[admissions] submission error:', error?.message ?? error);
    return res.status(500).json({ error: 'Erreur lors de la soumission du dossier.' });
  }
});

/**
 * GET /api/admissions/track?email=...
 * PUBLIC — lets a parent follow their dossier(s) without an account, by deposit email.
 * Returns only status-relevant fields (no document URLs / internal notes).
 */
router.get('/track', async (req: Request, res: Response) => {
  try {
    const email = String(req.query.email || '').trim().toLowerCase();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return res.status(400).json({ error: 'Adresse email invalide.' });
    }
    const admissions = await prisma.admission.findMany({
      where: { parentEmail: email },
      orderBy: { createdAt: 'desc' },
      select: {
        studentFirstName: true,
        studentLastName: true,
        level: true,
        status: true,
        testDate: true,
        studentNumber: true,
        createdAt: true,
      },
    });
    return res.json({ count: admissions.length, admissions });
  } catch (error: any) {
    console.error('[admissions] track error:', error?.message ?? error);
    return res.status(500).json({ error: 'Erreur lors de la recherche du dossier.' });
  }
});

// Admin-only routes for managing applications.
router.use(verifyToken, requireRole('admin'));

router.get('/', async (_req: Request, res: Response) => {
  try {
    const admissions = await prisma.admission.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(admissions);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des dossiers.' });
  }
});

router.patch('/:id/schedule', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { testDate } = req.body;
    if (!testDate) return res.status(400).json({ error: 'testDate requis.' });
    const admission = await prisma.admission.update({
      where: { id },
      data: { testDate: new Date(testDate), status: 'TEST_SCHEDULED' },
    });
    return res.json(admission);
  } catch (error) {
    console.error('[admissions] schedule error:', error);
    return res.status(500).json({ error: 'Erreur lors de la planification.' });
  }
});

export default router;
