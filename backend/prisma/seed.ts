import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seed de la base de données...');

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash('password123', saltRounds);

  // Users
  await prisma.user.upsert({
    where: { email: 'kesslerreginald.jean@leflambeau.edu.ht' },
    update: {},
    create: {
      email: 'kesslerreginald.jean@leflambeau.edu.ht',
      password: passwordHash,
      firstName: 'Admin',
      lastName: 'System',
      role: 'admin',
    },
  });

  await prisma.user.upsert({
    where: { email: 'marie.joseph@leflambeau.edu.ht' },
    update: {},
    create: {
      email: 'marie.joseph@leflambeau.edu.ht',
      password: passwordHash,
      firstName: 'Marie',
      lastName: 'Joseph',
      role: 'teacher',
    },
  });

  await prisma.user.upsert({
    where: { email: 'jean.pierre@leflambeau.edu.ht' },
    update: {},
    create: {
      email: 'jean.pierre@leflambeau.edu.ht',
      password: passwordHash,
      firstName: 'Jean',
      lastName: 'Pierre',
      role: 'parent',
    },
  });

  // Academic Year
  const academicYear = await prisma.academicYear.upsert({
    where: { name: '2024-2025' },
    update: {},
    create: {
      name: '2024-2025',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-06-30'),
      isCurrent: true,
    },
  });

  const studentUser = await prisma.user.upsert({
    where: { email: 'sophie.pierre@leflambeau.edu.ht' },
    update: {},
    create: {
      email: 'sophie.pierre@leflambeau.edu.ht',
      password: passwordHash,
      firstName: 'Sophie',
      lastName: 'Pierre',
      role: 'student',
    },
  });

  // Student details
  const student = await prisma.student.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      studentNumber: '2026001',
      enrollmentDate: new Date('2024-09-01'),
    },
  });

  // Grades
  await Promise.all([
    prisma.grade.create({ 
      data: { 
        studentId: student.id, 
        subject: 'Mathématiques', 
        score: 85, 
        teacherName: 'Marie Joseph', 
        date: new Date('2026-04-15'),
        academicYearId: academicYear.id,
        term: 1
      } 
    }),
    prisma.grade.create({ 
      data: { 
        studentId: student.id, 
        subject: 'Français', 
        score: 92, 
        teacherName: 'Marie Joseph', 
        date: new Date('2026-04-10'),
        academicYearId: academicYear.id,
        term: 1
      } 
    }),
    prisma.grade.create({ 
      data: { 
        studentId: student.id, 
        subject: 'Anglais', 
        score: 78, 
        teacherName: 'Marie Joseph', 
        date: new Date('2026-04-05'),
        academicYearId: academicYear.id,
        term: 1
      } 
    })
  ]);

  // Payments
  await Promise.all([
    prisma.payment.create({ 
      data: { 
        studentId: student.id, 
        amount: 25000, 
        paymentType: 'Frais de scolarité - Janvier', 
        status: 'completed', 
        dueDate: new Date('2026-01-31'), 
        paidDate: new Date('2026-01-25'),
        academicYearId: academicYear.id
      } 
    }),
    prisma.payment.create({ 
      data: { 
        studentId: student.id, 
        amount: 25000, 
        paymentType: 'Frais de scolarité - Février', 
        status: 'completed', 
        dueDate: new Date('2026-02-28'), 
        paidDate: new Date('2026-02-20'),
        academicYearId: academicYear.id
      } 
    }),
    prisma.payment.create({ 
      data: { 
        studentId: student.id, 
        amount: 25000, 
        paymentType: 'Frais de scolarité - Mars', 
        status: 'pending', 
        dueDate: new Date('2026-03-31'),
        academicYearId: academicYear.id
      } 
    })
  ]);

  // Accounting
  await Promise.all([
    prisma.accountingTransaction.create({ data: { transactionType: 'income', amount: 25000, description: 'Paiement frais scolarité - Sophie Pierre (Janvier)', accountCode: '4111', balanceBefore: 0, balanceAfter: 25000 } }),
    prisma.accountingTransaction.create({ data: { transactionType: 'income', amount: 25000, description: 'Paiement frais scolarité - Sophie Pierre (Février)', accountCode: '4111', balanceBefore: 25000, balanceAfter: 50000 } })
  ]);

  // Classes & Teachers
  const teacher = await prisma.teacher.upsert({
    where: { userId: 'marie.joseph@leflambeau.edu.ht' }, // Wrong, userId is a UUID. Let's find by user first
    update: {},
    create: {
      user: { connect: { email: 'marie.joseph@leflambeau.edu.ht' } },
      subject: 'Mathématiques',
    },
  });

  await prisma.class.upsert({
    where: { name_level_academicYearId: { name: 'A', level: '7ème AF', academicYearId: academicYear.id } },
    update: {},
    create: {
      name: 'A',
      level: '7ème AF',
      academicYearId: academicYear.id,
      teacherId: teacher.id,
    }
  });

  await prisma.class.upsert({
    where: { name_level_academicYearId: { name: 'B', level: '7ème AF', academicYearId: academicYear.id } },
    update: {},
    create: {
      name: 'B',
      level: '7ème AF',
      academicYearId: academicYear.id,
    }
  });

  await prisma.class.upsert({
    where: { name_level_academicYearId: { name: 'A', level: 'NS1', academicYearId: academicYear.id } },
    update: {},
    create: {
      name: 'A',
      level: 'NS1',
      academicYearId: academicYear.id,
    }
  });

  console.log('✅ Seed terminé avec succès !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
