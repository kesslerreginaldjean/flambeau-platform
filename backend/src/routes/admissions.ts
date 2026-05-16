import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();
const prisma = new PrismaClient();

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = 'uploads/admissions';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Format de fichier non supporté (Uniquement JPG, PNG, PDF)'));
  }
});

const uploadFields = upload.fields([
  { name: 'birthCertificate', maxCount: 1 },
  { name: 'reportCard', maxCount: 1 },
  { name: 'identityPhotos', maxCount: 1 },
  { name: 'medicalCertificate', maxCount: 1 }
]);

// POST /api/admissions - Soumettre une nouvelle candidature
router.post('/', uploadFields, async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, level, message } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const admission = await prisma.admission.create({
      data: {
        studentFirstName: firstName,
        studentLastName: lastName,
        parentEmail: email,
        parentPhone: phone,
        level: level,
        notes: message,
        birthCertificateUrl: files['birthCertificate'] ? `/uploads/admissions/${files['birthCertificate'][0].filename}` : null,
        reportCardUrl: files['reportCard'] ? `/uploads/admissions/${files['reportCard'][0].filename}` : null,
        identityPhotosUrl: files['identityPhotos'] ? `/uploads/admissions/${files['identityPhotos'][0].filename}` : null,
        medicalCertificateUrl: files['medicalCertificate'] ? `/uploads/admissions/${files['medicalCertificate'][0].filename}` : null,
        status: 'NEW'
      }
    });

    res.status(201).json({ message: 'Candidature reçue avec succès !', admission });
  } catch (error: any) {
    console.error('Erreur admission:', error);
    res.status(500).json({ error: error.message || 'Erreur lors de la soumission du dossier.' });
  }
});

// GET /api/admissions - Liste toutes les candidatures (Admin)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const admissions = await prisma.admission.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(admissions);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des dossiers.' });
  }
});

// PATCH /api/admissions/:id/status - Mettre à jour le statut
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    // Si validation, on peut avoir de la logique complexe ici, 
    // mais pour l'instant on se contente de mettre à jour le statut.
    const admission = await prisma.admission.update({
      where: { id },
      data: { status, ...(notes && { notes }) }
    });
    res.json(admission);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du statut.' });
  }
});

// PATCH /api/admissions/:id/schedule - Planifier un test / entretien
router.patch('/:id/schedule', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { testDate } = req.body;
    const admission = await prisma.admission.update({
      where: { id },
      data: { 
        testDate: new Date(testDate), 
        status: 'TEST_SCHEDULED' 
      }
    });
    res.json(admission);
  } catch (error) {
    console.error('Erreur planification:', error);
    res.status(500).json({ error: 'Erreur lors de la planification.' });
  }
});

export default router;
