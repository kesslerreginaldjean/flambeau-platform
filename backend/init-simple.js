const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const dataFile = path.join(__dirname, 'data.json');

console.log('🔥 Initialisation données Collège Le Flambeau (JSON)');

const saltRounds = 10;

// Données de test
const data = {
  users: [
    {
      id: 'admin-1',
      email: 'admin@leflambeau.edu.ht',
      password: '', // sera hashé
      firstName: 'Admin',
      lastName: 'System',
      role: 'admin',
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      id: 'teacher-1',
      email: 'teacher@leflambeau.edu.ht',
      password: '',
      firstName: 'Marie',
      lastName: 'Joseph',
      role: 'teacher',
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      id: 'parent-1',
      email: 'parent@leflambeau.edu.ht',
      password: '',
      firstName: 'Jean',
      lastName: 'Pierre',
      role: 'parent',
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      id: 'student-1',
      email: 'student@leflambeau.edu.ht',
      password: '',
      firstName: 'Sophie',
      lastName: 'Pierre',
      role: 'student',
      status: 'active',
      createdAt: new Date().toISOString()
    }
  ],
  students: [
    {
      id: 'student-1',
      userId: 'student-1',
      studentNumber: '2026001',
      classLevel: 'Terminale',
      className: 'Terminale A',
      enrollmentDate: '2024-09-01'
    }
  ],
  grades: [
    {
      id: 'grade-1',
      studentId: 'student-1',
      subject: 'Mathématiques',
      score: 85,
      teacherName: 'Marie Joseph',
      date: '2026-04-15'
    },
    {
      id: 'grade-2',
      studentId: 'student-1',
      subject: 'Français',
      score: 92,
      teacherName: 'Marie Joseph',
      date: '2026-04-10'
    },
    {
      id: 'grade-3',
      studentId: 'student-1',
      subject: 'Anglais',
      score: 78,
      teacherName: 'Marie Joseph',
      date: '2026-04-05'
    },
    {
      id: 'grade-4',
      studentId: 'student-1',
      subject: 'Histoire',
      score: 88,
      teacherName: 'Marie Joseph',
      date: '2026-04-01'
    }
  ],
  payments: [
    {
      id: 'payment-1',
      studentId: 'student-1',
      amount: 25000,
      paymentType: 'Frais de scolarité - Janvier',
      status: 'completed',
      dueDate: '2026-01-31',
      paidDate: '2026-01-25',
      notes: 'Paiement mensuel',
      createdAt: new Date().toISOString()
    },
    {
      id: 'payment-2',
      studentId: 'student-1',
      amount: 25000,
      paymentType: 'Frais de scolarité - Février',
      status: 'completed',
      dueDate: '2026-02-28',
      paidDate: '2026-02-20',
      notes: 'Paiement mensuel',
      createdAt: new Date().toISOString()
    },
    {
      id: 'payment-3',
      studentId: 'student-1',
      amount: 25000,
      paymentType: 'Frais de scolarité - Mars',
      status: 'pending',
      dueDate: '2026-03-31',
      notes: 'Paiement mensuel',
      createdAt: new Date().toISOString()
    }
  ],
  accounting: [
    {
      id: 'trans-1',
      transactionType: 'income',
      amount: 25000,
      description: 'Paiement frais scolarité - Sophie Pierre (Janvier)',
      accountCode: '4111',
      balanceBefore: 0,
      balanceAfter: 25000,
      createdAt: new Date().toISOString()
    },
    {
      id: 'trans-2',
      transactionType: 'income',
      amount: 25000,
      description: 'Paiement frais scolarité - Sophie Pierre (Février)',
      accountCode: '4111',
      balanceBefore: 25000,
      balanceAfter: 50000,
      createdAt: new Date().toISOString()
    }
  ]
};

// Hasher les mots de passe
async function hashPasswords() {
  for (let user of data.users) {
    user.password = await bcrypt.hash('password123', saltRounds);
  }

  // Sauvegarder les données
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  console.log('✅ Base de données JSON créée avec succès!');
  console.log('📁 Fichier:', dataFile);
  console.log('');
  console.log('📊 Données créées:');
  console.log('   👥 4 utilisateurs');
  console.log('   📚 1 élève avec 4 notes');
  console.log('   💰 3 paiements');
  console.log('   📊 2 transactions comptables');
  console.log('');
  console.log('🚀 Prêt pour le développement!');
}

hashPasswords().catch(console.error);