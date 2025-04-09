// middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_dev_secret';

export interface AuthenticatedRequest extends Request {
  user?: {
    accountID: string;
    userID: string;
    role: string;
  };
}

export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; // Expecting: Bearer <token>

  if (!token) {
    res.status(401).json({ error: 'Missing token' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { accountID: string; role: string };

    const user = await prisma.user.findUnique({
      where: { accountID: decoded.accountID },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found for accountID' });
      return;
    }

    req.user = {
      accountID: decoded.accountID,
      userID: user.userID,
      role: decoded.role,
    };

    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
}
