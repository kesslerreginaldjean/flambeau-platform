const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.join(__dirname, 'flambeau.db');

console.log('🔥 Initialisation base de données Collège Le Flambeau');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erreur connexion DB:', err);
    return;
  }
  console.log('✅ Connecté à SQLite');
});

// Créer les tables
db.serialize(() => {
  // Table utilisateurs
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Table élèves
  db.run(`CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    userId TEXT,
    studentNumber TEXT UNIQUE,
    classLevel TEXT,
    className TEXT,
    enrollmentDate DATE,
    FOREIGN KEY (userId) REFERENCES users(id)
  )`);

  // Table notes
  db.run(`CREATE TABLE IF NOT EXISTS grades (
    id TEXT PRIMARY KEY,
    studentId TEXT NOT NULL,
    subject TEXT NOT NULL,
    score REAL NOT NULL,
    teacherName TEXT,
    date DATE,
    FOREIGN KEY (studentId) REFERENCES students(id)
  )`);

  // Table paiements
  db.run(`CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    studentId TEXT NOT NULL,
    amount REAL NOT NULL,
    paymentType TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    dueDate DATE,
    paidDate DATE,
    notes TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (studentId) REFERENCES students(id)
  )`);

  // Table transactions comptables
  db.run(`CREATE TABLE IF NOT EXISTS accounting_transactions (
    id TEXT PRIMARY KEY,
    transactionType TEXT NOT NULL,
    amount REAL NOT NULL,
    description TEXT,
    accountCode TEXT,
    balanceBefore REAL,
    balanceAfter REAL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  console.log('✅ Tables créées');

  // Insérer données de test
  const saltRounds = 10;

  // Utilisateurs de test
  const users = [
    { id: 'admin-1', email: 'admin@leflambeau.edu.ht', password: 'password123', firstName: 'Admin', lastName: 'System', role: 'admin' },
    { id: 'teacher-1', email: 'teacher@leflambeau.edu.ht', password: 'password123', firstName: 'Marie', lastName: 'Joseph', role: 'teacher' },
    { id: 'parent-1', email: 'parent@leflambeau.edu.ht', password: 'password123', firstName: 'Jean', lastName: 'Pierre', role: 'parent' },
    { id: 'student-1', email: 'student@leflambeau.edu.ht', password: 'password123', firstName: 'Sophie', lastName: 'Pierre', role: 'student' },
  ];

  let usersInserted = 0;
  users.forEach(user => {
    bcrypt.hash(user.password, saltRounds, (err, hash) => {
      if (err) {
        console.error('Erreur hash password:', err);
        return;
      }

      db.run(`INSERT OR IGNORE INTO users (id, email, password, firstName, lastName, role) VALUES (?, ?, ?, ?, ?, ?)`,
        [user.id, user.email, hash, user.firstName, user.lastName, user.role],
        function(err) {
          if (err) {
            console.error('Erreur insertion user:', err);
          } else {
            console.log(`✅ Utilisateur ${user.email} créé`);
          }
          usersInserted++;
          if (usersInserted === users.length) {
            insertStudents();
          }
        }
      );
    });
  });

  function insertStudents() {
    // Élève de test
    db.run(`INSERT OR IGNORE INTO students (id, userId, studentNumber, classLevel, className, enrollmentDate) VALUES (?, ?, ?, ?, ?, ?)`,
      ['student-1', 'student-1', '2026001', 'Terminale', 'Terminale A', '2024-09-01'],
      function(err) {
        if (err) {
          console.error('Erreur insertion student:', err);
        } else {
          console.log('✅ Élève créé');
          insertGrades();
        }
      }
    );
  }

  function insertGrades() {
    // Notes de test
    const grades = [
      { id: 'grade-1', studentId: 'student-1', subject: 'Mathématiques', score: 85, teacherName: 'Marie Joseph', date: '2026-04-15' },
      { id: 'grade-2', studentId: 'student-1', subject: 'Français', score: 92, teacherName: 'Marie Joseph', date: '2026-04-10' },
      { id: 'grade-3', studentId: 'student-1', subject: 'Anglais', score: 78, teacherName: 'Marie Joseph', date: '2026-04-05' },
      { id: 'grade-4', studentId: 'student-1', subject: 'Histoire', score: 88, teacherName: 'Marie Joseph', date: '2026-04-01' },
    ];

    let gradesInserted = 0;
    grades.forEach(grade => {
      db.run(`INSERT OR IGNORE INTO grades (id, studentId, subject, score, teacherName, date) VALUES (?, ?, ?, ?, ?, ?)`,
        [grade.id, grade.studentId, grade.subject, grade.score, grade.teacherName, grade.date],
        function(err) {
          if (err) {
            console.error('Erreur insertion grade:', err);
          }
          gradesInserted++;
          if (gradesInserted === grades.length) {
            insertPayments();
          }
        }
      );
    });
  }

  function insertPayments() {
    // Paiements de test
    const payments = [
      { id: 'payment-1', studentId: 'student-1', amount: 25000, paymentType: 'Frais de scolarité - Janvier', status: 'completed', dueDate: '2026-01-31', paidDate: '2026-01-25', notes: 'Paiement mensuel' },
      { id: 'payment-2', studentId: 'student-1', amount: 25000, paymentType: 'Frais de scolarité - Février', status: 'completed', dueDate: '2026-02-28', paidDate: '2026-02-20', notes: 'Paiement mensuel' },
      { id: 'payment-3', studentId: 'student-1', amount: 25000, paymentType: 'Frais de scolarité - Mars', status: 'pending', dueDate: '2026-03-31', notes: 'Paiement mensuel' },
      { id: 'payment-4', studentId: 'student-1', amount: 50000, paymentType: 'Inscription annuelle', status: 'completed', dueDate: '2026-09-01', paidDate: '2026-08-25', notes: 'Frais d\'inscription' },
    ];

    let paymentsInserted = 0;
    payments.forEach(payment => {
      db.run(`INSERT OR IGNORE INTO payments (id, studentId, amount, paymentType, status, dueDate, paidDate, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [payment.id, payment.studentId, payment.amount, payment.paymentType, payment.status, payment.dueDate, payment.paidDate, payment.notes],
        function(err) {
          if (err) {
            console.error('Erreur insertion payment:', err);
          }
          paymentsInserted++;
          if (paymentsInserted === payments.length) {
            insertAccounting();
          }
        }
      );
    });
  }

  function insertAccounting() {
    // Transactions comptables de test
    const transactions = [
      { id: 'trans-1', transactionType: 'income', amount: 25000, description: 'Paiement frais scolarité - Sophie Pierre (Janvier)', accountCode: '4111', balanceBefore: 0, balanceAfter: 25000 },
      { id: 'trans-2', transactionType: 'income', amount: 25000, description: 'Paiement frais scolarité - Sophie Pierre (Février)', accountCode: '4111', balanceBefore: 25000, balanceAfter: 50000 },
      { id: 'trans-3', transactionType: 'income', amount: 50000, description: 'Paiement inscription - Sophie Pierre', accountCode: '4111', balanceBefore: 50000, balanceAfter: 100000 },
      { id: 'trans-4', transactionType: 'expense', amount: 15000, description: 'Achat fournitures scolaires', accountCode: '6011', balanceBefore: 100000, balanceAfter: 85000 },
    ];

    let transactionsInserted = 0;
    transactions.forEach(transaction => {
      db.run(`INSERT OR IGNORE INTO accounting_transactions (id, transactionType, amount, description, accountCode, balanceBefore, balanceAfter) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [transaction.id, transaction.transactionType, transaction.amount, transaction.description, transaction.accountCode, transaction.balanceBefore, transaction.balanceAfter],
        function(err) {
          if (err) {
            console.error('Erreur insertion transaction:', err);
          }
          transactionsInserted++;
          if (transactionsInserted === transactions.length) {
            console.log('✅ Base de données initialisée avec succès!');
            console.log('');
            console.log('📊 Données de test créées:');
            console.log('   👥 4 utilisateurs (admin, teacher, parent, student)');
            console.log('   📚 1 élève avec 4 notes');
            console.log('   💰 4 paiements (2 payés, 2 en attente)');
            console.log('   📊 4 transactions comptables');
            console.log('');
            console.log('🚀 Vous pouvez maintenant lancer les serveurs avec start.bat');
            db.close();
          }
        }
      );
    });
  }
});