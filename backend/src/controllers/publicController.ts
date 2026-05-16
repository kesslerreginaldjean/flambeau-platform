import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const submitAdmission = async (req: Request, res: Response) => {
  const { studentFirstName, studentLastName, parentEmail, parentPhone, level } = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  try {
    const admission = await prisma.admission.create({
      data: {
        studentFirstName,
        studentLastName,
        parentEmail,
        parentPhone,
        level,
        status: 'NEW',
        birthCertificateUrl: files['birthCertificate']?.[0]?.filename,
        reportCardUrl: files['reportCard']?.[0]?.filename,
        identityPhotosUrl: files['identityPhotos']?.[0]?.filename,
        medicalCertificateUrl: files['medicalCertificate']?.[0]?.filename,
      }
    });

    return res.status(201).json({ 
      message: 'Candidature soumise avec succès !', 
      admissionId: admission.id 
    });
  } catch (error) {
    console.error('Admission submission error:', error);
    return res.status(500).json({ error: 'Erreur lors de la soumission de la candidature.' });
  }
};

export const getSchoolPublicInfo = async (_req: Request, res: Response) => {
  try {
    const settings = await prisma.schoolSettings.findUnique({ where: { id: 'global' } });
    return res.json(settings);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch school info' });
  }
};
