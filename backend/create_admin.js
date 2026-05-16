const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash('admin123', 10);
  try {
    const u = await prisma.user.create({
      data: {
        email: 'admin@test.com',
        password: hashed,
        firstName: 'Kessler',
        lastName: 'Admin',
        role: 'admin',
        status: 'active'
      }
    });
    console.log('✅ Admin créé avec succès :', u.email);
    console.log('🔑 Mot de passe : admin123');
  } catch (error) {
    console.error('❌ Erreur lors de la création :', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
