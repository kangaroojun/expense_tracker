// services/account.service.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_dev_secret';

export class AccountService {
  async register(username: string, email: string, plainPassword: string) {
    const existingUser = await prisma.account.findFirst({
      where: {
        OR: [{ username }, { email }]
      }
    });

    if (existingUser) {
      throw new Error('Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const account = await prisma.account.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: 'User', // or any default role
      }
    });

    // Optionally create User record linked to Account
    const user = await prisma.user.create({
      data: {
        accountID: account.accountID
      }
    });

    // Optional: return a JWT
    const token = jwt.sign(
      {
        accountID: account.accountID,
        role: account.role,
      },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    return { message: 'Account created successfully', token };
  }

  // You already have this
    async login(email: string, plainPassword: string) {
        const account = await prisma.account.findUnique({
        where: { email },
        });

        if (!account) {
        throw new Error('Account not found');
        }

        const isPasswordValid = await bcrypt.compare(plainPassword, account.password);
        if (!isPasswordValid) {
        throw new Error('Invalid password');
        }

        // Return a JWT
        const token = jwt.sign(
        {
            accountID: account.accountID,
            role: account.role,
        },
        JWT_SECRET,
        { expiresIn: '2h' }
        );

        return { token };
    }
}
