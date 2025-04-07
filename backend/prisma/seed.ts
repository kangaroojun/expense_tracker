// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

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

  const hashedPassword = await bcrypt.hash("password123", 10);

  // Create a test account and user
  const account = await prisma.account.create({
    data: {
      email: "test@example.com",
      password: hashedPassword,
      role: "User",
    }
  });
  
  const user = await prisma.user.create({
    data: {
      accountID: account.accountID,
    }
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });
