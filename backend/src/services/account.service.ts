// services/account.service.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_dev_secret';

export class AccountService {
  constructor(private prisma = new PrismaClient()) {}

  async register(email: string, plainPassword: string) {
    const existingUser = await this.prisma.account.findFirst({
      where: { email },
    });

    if (existingUser) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const account = await this.prisma.account.create({
      data: {
        email,
        password: hashedPassword,
        role: 'User', // or any default role
      }
    });

    const user = await this.prisma.user.create({
      data: {
        accountID: account.accountID
      }
    });

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

  async login(email: string, plainPassword: string) {
    const account = await this.prisma.account.findUnique({
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

  async getAllAccounts() {
    const accounts = await this.prisma.account.findMany({
      select: {
        accountID: true,
        email: true,
        role: true,
      },
    });

    return accounts;
  }

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      include: {
        account: {
          select: {
            email: true,
            role: true,
          }
        }
      }
    });

    return users.map(user => ({
      userID: user.userID,
      email: user.account.email,
      role: user.account.role,
    }));
  }
}
