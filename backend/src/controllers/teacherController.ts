import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTeacherDashboard = async (req: Request, res: Response) => {
  const { id } = req.params; // userId

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        teacher: {
          include: {
            classesTitulaire: true,
            assignedSubjects: {
              include: {
                class: true
              }
            }
          }
        }
      }
    });

    if (!user) return res.status(404).json({ error: 'Teacher not found' });

    const announcements = await prisma.announcement.findMany({
      where: { OR: [{ target: 'all' }, { target: 'teachers' }] },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    // Total unique students across all assigned classes
    const classIds = user.teacher?.assignedSubjects.map(as => as.classId) || [];
    const totalStudents = await prisma.enrollment.count({
      where: { classId: { in: classIds }, academicYear: { isCurrent: true } }
    });

    return res.json({
      profile: user,
      announcements,
      assignedClasses: user.teacher?.assignedSubjects || [],
      classesTitulaire: user.teacher?.classesTitulaire || [],
      stats: {
        totalStudents,
        teachingHours: user.teacher?.assignedSubjects.reduce((acc, curr) => acc + curr.periods, 0) || 0,
        gradingPending: 0,
        attendanceRate: 100
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch teacher dashboard' });
  }
};

export const getTeacherClasses = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { userId: id },
      include: {
        assignedSubjects: { include: { class: true } },
        classesTitulaire: true
      }
    });
    return res.json(teacher);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch teacher classes' });
  }
};

export const getClassStudents = async (req: Request, res: Response) => {
  const { classId } = req.params;
  try {
    const students = await prisma.enrollment.findMany({
      where: { classId, academicYear: { isCurrent: true } },
      include: { student: { include: { user: true } } }
    });
    return res.json(students);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch class students' });
  }
};

export const submitAttendance = async (req: Request, res: Response) => {
  const { date, records } = req.body; // records: [{studentId, status, note}]
  try {
    const year = await prisma.academicYear.findFirst({ where: { isCurrent: true } });
    if (!year) return res.status(400).json({ error: 'No current academic year' });

    const attendanceRecords = await Promise.all(records.map((r: any) => 
      prisma.attendance.create({
        data: {
          studentId: r.studentId,
          academicYearId: year.id,
          date: new Date(date),
          status: r.status,
          reason: r.note
        }
      })
    ));

    return res.status(201).json(attendanceRecords);
  } catch (error) {
    console.error('Attendance submission error:', error);
    return res.status(500).json({ error: 'Failed to submit attendance' });
  }
};

export const submitGrades = async (req: Request, res: Response) => {
  const { academicYearId, subject, term, teacherName, grades } = req.body; // grades: [{studentId, score, notes}]
  try {
    let yearId = academicYearId;
    if (!yearId) {
      const year = await prisma.academicYear.findFirst({ where: { isCurrent: true } });
      yearId = year?.id;
    }
    
    if (!yearId) return res.status(400).json({ error: 'Academic year not found' });

    const gradeRecords = await Promise.all(grades.map((g: any) => 
      prisma.grade.create({
        data: {
          studentId: g.studentId,
          academicYearId: yearId,
          subject,
          score: parseFloat(g.score),
          term: parseInt(term),
          teacherName,
          notes: g.notes
        }
      })
    ));

    return res.status(201).json(gradeRecords);
  } catch (error) {
    console.error('Grades submission error:', error);
    return res.status(500).json({ error: 'Failed to submit grades' });
  }
};
