import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getSchoolPublicInfo = async (_req: Request, res: Response) => {
  try {
    const settings = await prisma.schoolSettings.findUnique({ where: { id: 'global' } });
    return res.json(settings);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch school info' });
  }
};
