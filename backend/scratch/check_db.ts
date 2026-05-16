import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, role: true, firstName: true }
  });
  console.log('Total users:', users.length);
  users.forEach(u => console.log(`- ${u.firstName} (${u.role}) ID: ${u.id}`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
