import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';
import { AuthRequest } from '../middleware/auth';
import { env } from '../lib/env';

export const getStats = async (_req: Request, res: Response) => {
  try {
    const studentCount = await prisma.user.count({ where: { role: 'student' } });
    const teacherCount = await prisma.user.count({ where: { role: 'teacher' } });
    const parentCount = await prisma.user.count({ where: { role: 'parent' } });
    
    // Revenue and Pending
    const [completedPayments, pendingPayments] = await Promise.all([
      prisma.payment.aggregate({
        where: { status: 'completed' },
        _sum: { amount: true }
      }),
      prisma.payment.aggregate({
        where: { status: 'pending' },
        _sum: { amount: true }
      })
    ]);

    return res.json({
      students: studentCount,
      teachers: teacherCount,
      parents: parentCount,
      revenue: completedPayments._sum.amount || 0,
      pending: pendingPayments._sum.amount || 0
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

export const getTeachers = async (_req: Request, res: Response) => {
  try {
    const teachers = await prisma.user.findMany({
      where: { role: 'teacher' },
      include: { teacher: true },
      orderBy: { lastName: 'asc' }
    });
    return res.json(teachers);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch teachers' });
  }
};

export const getStudents = async (_req: Request, res: Response) => {
  try {
    const students = await prisma.user.findMany({
      where: { role: 'student' },
      include: { 
        student: {
          include: {
            enrollments: {
              where: { academicYear: { isCurrent: true } },
              include: { 
                academicYear: true,
                class: true 
              }
            }
          }
        } 
      },
      orderBy: { lastName: 'asc' }
    });
    return res.json(students);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch students' });
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        student: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { 
    email, password, firstName, lastName, role, 
    phone, address, dateOfBirth, gender,
    studentData, teacherData, parentData 
  } = req.body;

  try {
    if (!password || typeof password !== 'string' || password.length < 10) {
      return res.status(400).json({ error: 'Mot de passe requis (10 caractères minimum).' });
    }
    const hashedPassword = await bcrypt.hash(password, env.BCRYPT_COST);
    
    // Get current academic year for student enrollment
    const currentYear = await prisma.academicYear.findFirst({
      where: { isCurrent: true }
    });

    // Audit fix: validate role against an allow-list (admin can create any of these).
    const ALLOWED_ROLES = ['admin', 'teacher', 'parent', 'student'];
    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({ error: 'Rôle invalide.' });
    }

    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          role,
          phone,
          address,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          gender
        }
      });

      if (role === 'student' && studentData) {
        if (!currentYear) throw new Error('No current academic year defined');
        
        const student = await tx.student.create({
          data: {
            userId: user.id,
            studentNumber: studentData.studentNumber || `CLF-${Date.now()}`,
            enrollmentDate: new Date()
          }
        });

        await tx.enrollment.create({
          data: {
            studentId: student.id,
            academicYearId: currentYear.id,
            classId: studentData.classId || '', // Assurez-vous que classId est fourni
          }
        });
      } else if (role === 'teacher') {
        await tx.teacher.create({
          data: {
            userId: user.id,
            subject: teacherData?.subject
          }
        });
      } else if (role === 'parent') {
        await tx.parent.create({
          data: {
            userId: user.id,
            occupation: parentData?.occupation
          }
        });
      }

      return user;
    });

    return res.status(201).json(newUser);
  } catch (error: any) {
    console.error('Create user error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    return res.status(500).json({ error: error.message || 'Failed to create user' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // Cascade delete is handled by database or manually if needed
    // In our SQLite setup with Prisma, we'll do it manually to be safe
    const student = await prisma.student.findUnique({ where: { userId: id } });
    if (student) {
      await prisma.enrollment.deleteMany({ where: { studentId: student.id } });
      await prisma.grade.deleteMany({ where: { studentId: student.id } });
      await prisma.payment.deleteMany({ where: { studentId: student.id } });
      await prisma.attendance.deleteMany({ where: { studentId: student.id } });
      await prisma.behavior.deleteMany({ where: { studentId: student.id } });
      await prisma.document.deleteMany({ where: { studentId: student.id } });
      await prisma.student.delete({ where: { id: student.id } });
    }
    
    await prisma.teacher.deleteMany({ where: { userId: id } });
    await prisma.parent.deleteMany({ where: { userId: id } });
    
    await prisma.message.deleteMany({
      where: { OR: [{ senderId: id }, { receiverId: id }] }
    });

    await prisma.user.delete({ where: { id } });
    
    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ error: 'Failed to delete user' });
  }
};

export const importUsers = async (req: Request, res: Response) => {
  const { users } = req.body;
  
  if (!Array.isArray(users)) {
    return res.status(400).json({ error: 'Data must be an array of users' });
  }

  try {
    const currentYear = await prisma.academicYear.findFirst({
      where: { isCurrent: true }
    });

    if (!currentYear) {
      return res.status(400).json({ error: 'Veuillez d\'abord créer une année académique en cours.' });
    }

    const results = await Promise.all(users.map(async (userData) => {
      try {
        await prisma.$transaction(async (tx) => {
          // Audit fix: require a real password per imported user instead of a
          // shared hard-coded hash. If absent, generate a random one and force
          // password reset on first login (status='pending_password_reset').
          let passwordHash: string;
          let status = 'active';
          if (userData.password && typeof userData.password === 'string' && userData.password.length >= 10) {
            passwordHash = await bcrypt.hash(userData.password, env.BCRYPT_COST);
          } else {
            const tempPwd = require('crypto').randomBytes(16).toString('hex');
            passwordHash = await bcrypt.hash(tempPwd, env.BCRYPT_COST);
            status = 'pending_password_reset';
          }

          const safeRole = ['student', 'parent', 'teacher'].includes(userData.role) ? userData.role : 'student';

          const user = await tx.user.create({
            data: {
              email: userData.email,
              password: passwordHash,
              firstName: userData.firstName,
              lastName: userData.lastName,
              role: safeRole,
              phone: userData.phone,
              gender: userData.gender || 'M',
              status,
            }
          });

          if (user.role === 'student') {
            const student = await tx.student.create({
              data: {
                userId: user.id,
                studentNumber: `CLF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                enrollmentDate: new Date()
              }
            });

            await tx.enrollment.create({
              data: {
                studentId: student.id,
                academicYearId: currentYear.id,
                classId: userData.classId || '',
              }
            });
          }
        });
        return { email: userData.email, status: 'success' };
      } catch (err) {
        return { email: userData.email, status: 'error', message: 'User already exists or invalid data' };
      }
    }));

    return res.json({ message: 'Import completed', results });
  } catch (error) {
    return res.status(500).json({ error: 'Global import error' });
  }
};

export const getPayments = async (_req: Request, res: Response) => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        student: { include: { user: true } },
        academicYear: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(payments);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

/**
 * POST /api/admin/payments
 *
 * Audit P1-3:
 *  - Wrapped in a single prisma.$transaction so payment + accounting either both
 *    succeed or both rollback (atomic).
 *  - `createdById` is set from the authenticated admin (audit trail).
 *  - Two concurrent calls cannot corrupt the running balance because the read
 *    (findFirst) and write (create) live in the same transaction; Prisma serialises
 *    transactions on SQLite, and on Postgres we add an advisory lock if needed.
 *  - Manual `status: 'completed'` is allowed (admin attestation) but stamped with
 *    actor + accounting ref so it can be audited.
 */
export const createPayment = async (req: AuthRequest, res: Response) => {
  const { studentId, amount, paymentType, status, dueDate, notes, academicYearId } = req.body;
  const actorId = req.user?.userId;

  try {
    const currentYearId = academicYearId
      || (await prisma.academicYear.findFirst({ where: { isCurrent: true } }))?.id;
    if (!currentYearId) return res.status(400).json({ error: 'Academic year required' });

    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          studentId,
          academicYearId: currentYearId,
          amount,
          paymentType,
          status,
          dueDate: new Date(dueDate),
          paidDate: status === 'completed' ? new Date() : null,
          notes,
          createdById: actorId,
        },
      });

      if (status === 'completed') {
        const last = await tx.accountingTransaction.findFirst({ orderBy: { createdAt: 'desc' } });
        const balanceBefore = last?.balanceAfter ?? 0;
        await tx.accountingTransaction.create({
          data: {
            transactionType: 'income',
            amount,
            description: `Paiement ${paymentType} (élève ${studentId})`,
            accountCode: '4111',
            balanceBefore,
            balanceAfter: balanceBefore + amount,
            referenceId: payment.id,
            createdById: actorId,
          },
        });
      }
      return payment;
    });

    return res.status(201).json(result);
  } catch (error: any) {
    console.error('[admin] createPayment:', error?.message ?? error);
    return res.status(500).json({ error: 'Failed to create payment' });
  }
};

// Suppress unused-var lint for env (kept for future Kotelam wiring).
void env;

export const submitGrade = async (req: Request, res: Response) => {
  const { studentId, subject, score, teacherName, term, academicYearId } = req.body;
  try {
    const currentYear = academicYearId || (await prisma.academicYear.findFirst({ where: { isCurrent: true } }))?.id;
    
    if (!currentYear) return res.status(400).json({ error: 'Academic year required' });

    const grade = await prisma.grade.create({
      data: {
        studentId,
        academicYearId: currentYear,
        subject,
        score,
        term: term || 1,
        teacherName,
        date: new Date()
      }
    });
    return res.status(201).json(grade);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to submit grade' });
  }
};

export const getAnnouncements = async (_req: Request, res: Response) => {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return res.json(announcements);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch announcements' });
  }
};

export const createAnnouncement = async (req: Request, res: Response) => {
  const { title, content, target, type } = req.body;
  try {
    const announcement = await prisma.announcement.create({
      data: { title, content, target, type }
    });
    return res.status(201).json(announcement);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create announcement' });
  }
};

export const deleteAnnouncement = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.announcement.delete({ where: { id } });
    return res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete announcement' });
  }
};

export const getStudentDetail = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const studentDetail = await prisma.user.findUnique({
      where: { id },
      include: {
        student: {
          include: {
            enrollments: { include: { academicYear: true, class: true }, orderBy: { academicYear: { startDate: 'desc' } } },
            grades: { include: { academicYear: true }, orderBy: { date: 'desc' } },
            attendance: { include: { academicYear: true }, orderBy: { date: 'desc' } },
            behaviors: { include: { academicYear: true }, orderBy: { date: 'desc' } },
            payments: { include: { academicYear: true }, orderBy: { createdAt: 'desc' } },
            documents: true,
          }
        }
      }
    });

    if (!studentDetail) return res.status(404).json({ error: 'Student not found' });
    return res.json(studentDetail);
  } catch (error) {
    console.error('Fetch student detail error:', error);
    return res.status(500).json({ error: 'Failed to fetch student details' });
  }
};

export const getSettings = async (_req: Request, res: Response) => {
  try {
    const settings = await prisma.schoolSettings.findUnique({ where: { id: 'global' } });
    return res.json(settings);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  const data = req.body;
  try {
    const settings = await prisma.schoolSettings.upsert({
      where: { id: 'global' },
      update: data,
      create: { ...data, id: 'global' }
    });
    return res.json(settings);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update settings' });
  }
};
export const getAdmissions = async (_req: Request, res: Response) => {
  try {
    const admissions = await prisma.admission.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return res.json(admissions);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch admissions' });
  }
};

export const updateAdmissionStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, notes, testDate, classId } = req.body;
  
  try {
    // If validated, we perform a transaction to create the user, student, and enrollment
    if (status === 'VALIDATED') {
      // Audit fix: generate a unique random password per student instead of a
      // shared "ChangerMoi123" hash. Status flagged so the user MUST reset on first login.
      const tempPassword = require('crypto').randomBytes(12).toString('base64url');
      const hashedDefaultPassword = await bcrypt.hash(tempPassword, env.BCRYPT_COST);
      // TODO: email the temp password securely to admission.parentEmail (out of scope here).

      const result = await prisma.$transaction(async (tx) => {
        const admission = await tx.admission.findUnique({ where: { id } });
        if (!admission) throw new Error('Admission not found');

        // 1. Create User (status forces password reset on first login)
        const user = await tx.user.create({
          data: {
            email: admission.parentEmail,
            password: hashedDefaultPassword,
            firstName: admission.studentFirstName,
            lastName: admission.studentLastName,
            role: 'student',
            status: 'pending_password_reset'
          }
        });

        // 2. Create Student
        const student = await tx.student.create({
          data: {
            userId: user.id,
            studentNumber: `STU-${Date.now().toString().slice(-6)}`,
            enrollmentDate: new Date()
          }
        });

        // 3. Create Enrollment
        const currentYear = await tx.academicYear.findFirst({ where: { isCurrent: true } });
        if (currentYear) {
           await tx.enrollment.create({
             data: {
               studentId: student.id,
               academicYearId: currentYear.id,
               classId: classId || 'temp-id'
             }
           });
        }

        // 4. Update admission status
        return await tx.admission.update({
          where: { id },
          data: { status, notes, testDate: testDate ? new Date(testDate) : undefined }
        });
      });

      return res.json({ message: 'Admission validée et compte étudiant créé', admission: result });
    }
    
    // Normal update for other statuses
    const admission = await prisma.admission.update({
      where: { id },
      data: { 
        status, 
        notes: notes !== undefined ? notes : undefined,
        testDate: testDate ? new Date(testDate) : undefined
      }
    });

    return res.json(admission);
  } catch (error: any) {
    console.error('Admission update error:', error);
    return res.status(500).json({ error: error.message || 'Failed to update admission status' });
  }
};

export const getAcademicInfo = async (_req: Request, res: Response) => {
  try {
    const currentYear = await prisma.academicYear.findFirst({
      where: { isCurrent: true },
      include: {
        classes: {
          include: {
            teacher: { include: { user: true } },
            _count: { select: { enrollments: true } }
          }
        }
      }
    });

    if (!currentYear) return res.status(404).json({ error: 'No current academic year found' });

    // Format classes for the frontend
    const formattedClasses = currentYear.classes.map(cls => ({
      id: cls.id,
      name: cls.name,
      level: cls.level,
      studentsCount: cls._count.enrollments,
      teacher: cls.teacher ? `${cls.teacher.user.firstName} ${cls.teacher.user.lastName}` : 'Non assigné'
    }));

    return res.json({
      currentYear: {
        id: currentYear.id,
        name: currentYear.name,
        startDate: currentYear.startDate,
        endDate: currentYear.endDate
      },
      classes: formattedClasses
    });
  } catch (error) {
    console.error('Failed to fetch academic info:', error);
    return res.status(500).json({ error: 'Failed to fetch academic info' });
  }
};
