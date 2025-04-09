import { authenticateToken } from '../src/middleware/auth.middleware';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      user: {
        findUnique: jest.fn().mockResolvedValue({ userID: 'user123' }),
      },
    })),
  };
});

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn().mockReturnValue({ accountID: 'acc123', role: 'User' }),
}));

describe('authenticateToken Middleware', () => {
  it('should attach user info to req and call next()', async () => {
    const req: any = {
      headers: { authorization: 'Bearer valid.token.here' },
    };
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await authenticateToken(req, res, next);

    expect(req.user).toEqual({
      accountID: 'acc123',
      userID: 'user123',
      role: 'User',
    });
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if no token is provided', async () => {
    const req: any = { headers: {} };
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing token' });
    expect(next).not.toHaveBeenCalled();
  });
});
