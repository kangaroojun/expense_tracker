// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const defaultCategories = ['Invention', 'Art', 'Business', 'Tech'];

  for (const description of defaultCategories) {
    await prisma.category.upsert({
      where: { description },
      update: {},
      create: { description },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });
