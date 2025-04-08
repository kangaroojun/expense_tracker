// __tests__/account.service.test.ts
import { AccountService } from '../src/services/account.service';
import prismaMock from '../__mocks__/prismaClient';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const mockHash = bcrypt.hash as jest.Mock;
const mockCompare = bcrypt.compare as jest.Mock;
const mockSign = jwt.sign as jest.Mock;

describe('AccountService', () => {
  const accountService = new AccountService(prismaMock as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user successfully', async () => {
    prismaMock.account.findFirst.mockResolvedValue(null);
    mockHash.mockResolvedValue('hashed_password');
    prismaMock.account.create.mockResolvedValue({
      accountID: 'account123',
      email: 'test@example.com',
      password: 'hashed_password',
      role: 'User',
    });
    prismaMock.user.create.mockResolvedValue({
      userID: 'user123',
      accountID: 'account123',
    });
    mockSign.mockReturnValue('mock_token');

    const result = await accountService.register('test@example.com', 'password123');

    expect(result.token).toBe('mock_token');
    expect(result.message).toBe('Account created successfully');
    expect(mockHash).toHaveBeenCalled();
    expect(mockSign).toHaveBeenCalled();
  });

  it('should not allow registering with existing email', async () => {
    prismaMock.account.findFirst.mockResolvedValue({ email: 'test@example.com' } as any);

    await expect(
      accountService.register('test@example.com', 'password123')
    ).rejects.toThrow('Email already exists');
  });

  it('should login a user and return token', async () => {
    prismaMock.account.findUnique.mockResolvedValue({
      accountID: 'account123',
      email: 'test@example.com',
      password: 'hashed_password',
      role: 'User',
    } as any);
    mockCompare.mockResolvedValue(true);
    mockSign.mockReturnValue('mock_token');

    const result = await accountService.login('test@example.com', 'password123');

    expect(result.token).toBe('mock_token');
    expect(mockCompare).toHaveBeenCalled();
    expect(mockSign).toHaveBeenCalled();
  });

  it('should throw error if login account not found', async () => {
    prismaMock.account.findUnique.mockResolvedValue(null);

    await expect(
      accountService.login('notfound@example.com', 'password123')
    ).rejects.toThrow('Account not found');
  });

  it('should throw error if password is incorrect', async () => {
    prismaMock.account.findUnique.mockResolvedValue({
      accountID: 'account123',
      email: 'test@example.com',
      password: 'hashed_password',
      role: 'User',
    } as any);
    mockCompare.mockResolvedValue(false);

    await expect(
      accountService.login('test@example.com', 'wrongpassword')
    ).rejects.toThrow('Invalid password');
  });

  it('should fetch all accounts', async () => {
    prismaMock.account.findMany.mockResolvedValue([
      { accountID: '1', email: 'a@example.com', role: 'User' },
      { accountID: '2', email: 'b@example.com', role: 'User' },
    ]);

    const accounts = await accountService.getAllAccounts();
    expect(accounts).toHaveLength(2);
    expect(accounts[0].email).toBe('a@example.com');
  });

  it('should fetch all users with email and role', async () => {
    prismaMock.user.findMany.mockResolvedValue([
      {
        userID: 'user1',
        account: { email: 'a@example.com', role: 'User' },
      },
      {
        userID: 'user2',
        account: { email: 'b@example.com', role: 'User' },
      },
    ] as any);

    const users = await accountService.getAllUsers();
    expect(users).toHaveLength(2);
    expect(users[0].email).toBe('a@example.com');
  });
});