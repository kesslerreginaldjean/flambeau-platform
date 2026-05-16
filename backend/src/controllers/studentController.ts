import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getStudentDashboard = async (req: Request, res: Response) => {
  const { id } = req.params; // userId

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        student: {
          include: {
            enrollments: {
              where: { academicYear: { isCurrent: true } },
              include: { academicYear: true }
            },
            grades: {
              take: 5,
              orderBy: { date: 'desc' },
              include: { academicYear: true }
            },
            attendance: {
              take: 5,
              orderBy: { date: 'desc' }
            },
            payments: {
              take: 5,
              orderBy: { createdAt: 'desc' }
            }
          }
        }
      }
    });

    if (!user) return res.status(404).json({ error: 'Student not found' });

    const announcements = await prisma.announcement.findMany({
      where: { OR: [{ target: 'all' }, { target: 'students' }] },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    return res.json({
      profile: user,
      enrollment: user.student?.enrollments[0] || null,
      recentGrades: user.student?.grades || [],
      recentAttendance: user.student?.attendance || [],
      recentPayments: user.student?.payments || [],
      announcements
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch student dashboard' });
  }
};

export const getStudentGrades = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const student = await prisma.student.findUnique({ where: { userId: id } });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const grades = await prisma.grade.findMany({
      where: { studentId: student.id },
      include: { academicYear: true },
      orderBy: [{ academicYear: { startDate: 'desc' } }, { term: 'desc' }]
    });
    return res.json(grades);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch grades' });
  }
};

export const getStudentPayments = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const student = await prisma.student.findUnique({ where: { userId: id } });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const payments = await prisma.payment.findMany({
      where: { studentId: student.id },
      include: { academicYear: true },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(payments);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch payments' });
  }
};
