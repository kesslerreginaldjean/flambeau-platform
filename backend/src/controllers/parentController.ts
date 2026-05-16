import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getParentDashboard = async (req: Request, res: Response) => {
  const { id } = req.params; // userId

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        parent: {
          include: {
            children: {
              include: {
                user: true,
                enrollments: {
                  where: { academicYear: { isCurrent: true } },
                  include: { class: true }
                }
              }
            }
          }
        }
      }
    });

    if (!user) return res.status(404).json({ error: 'Parent not found' });

    const announcements = await prisma.announcement.findMany({
      where: { OR: [{ target: 'all' }, { target: 'parents' }] },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    return res.json({
      profile: user,
      announcements,
      children: user.parent?.children || []
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch parent dashboard' });
  }
};

export const getChildDetails = async (req: Request, res: Response) => {
  const { childId } = req.params;
  try {
    const student = await prisma.student.findUnique({
      where: { id: childId },
      include: {
        user: true,
        enrollments: { include: { academicYear: true, class: true }, orderBy: { academicYear: { startDate: 'desc' } } },
        grades: { include: { academicYear: true }, orderBy: { date: 'desc' } },
        attendance: { include: { academicYear: true }, orderBy: { date: 'desc' } },
        behaviors: { include: { academicYear: true }, orderBy: { date: 'desc' } },
        payments: { include: { academicYear: true }, orderBy: { createdAt: 'desc' } },
        documents: true,
      }
    });
    return res.json(student);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch child details' });
  }
};
