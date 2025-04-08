// __mocks__/prismaClient.ts
const prismaMock = {
    account: {
        findFirst: jest.fn(),
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
    },
    user: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
    },
    idea: {
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
    },
    image: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findMany: jest.fn(),
    },
    $disconnect: jest.fn(),
};
    
export default prismaMock;
      