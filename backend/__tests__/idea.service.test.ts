import prismaMock from '../__mocks__/prismaClient';
import { IdeaService } from '../src/services/idea.service';
import { PrismaClient } from '@prisma/client';
import { ImageService } from '../src/services/image.service';

// Mock dependencies
jest.mock('../src/services/image.service');

jest.mock('@prisma/client', () => {
  const actual = jest.requireActual('@prisma/client');
  return {
    ...actual,
    PrismaClient: jest.fn(() => prismaMock),
  };
});

describe('IdeaService', () => {
  let ideaService: IdeaService;
  let imageServiceMock: jest.Mocked<ImageService>;

  beforeEach(() => {
    imageServiceMock = {
      createSketch: jest.fn(),
      getImageOnly: jest.fn(),
      getImageWithPaths: jest.fn(),
      updateSketch: jest.fn(),
      deleteSketch: jest.fn(),
    } as unknown as jest.Mocked<ImageService>;

    // Inject the mocked service
    ideaService = new IdeaService(imageServiceMock);
  });

  it('should create an idea when no sketch is provided', async () => {
    prismaMock.idea.create.mockResolvedValue({
      ideaID: 'idea123',
      name: 'Test Idea',
      content: 'Some content',
      userID: 'user123',
      categories: [],
      tags: ['Red'],
    });

    const result = await ideaService.createIdea({
      name: 'Test Idea',
      content: 'Some content',
      userID: 'user123',
      categories: ['Tech'],
      tags: ['Red'],
    });

    expect(prismaMock.idea.create).toHaveBeenCalled();
    expect(result.name).toBe('Test Idea');
  });

  it('should create an idea and call imageService if sketch data is provided', async () => {
    prismaMock.idea.create.mockResolvedValue({
      ideaID: 'idea123',
      name: 'Test Idea',
      content: 'Some content',
      userID: 'user123',
      categories: [],
      tags: ['Red'],
    });

    await ideaService.createIdea({
      name: 'Test Idea',
      content: 'Some content',
      userID: 'user123',
      categories: ['Tech'],
      tags: ['Red'],
      sketchBase64: 'data:image/png;base64,...',
      sketchFormat: 'png',
      paths: [],
    });

    expect(imageServiceMock.createSketch).toHaveBeenCalledWith(
      expect.objectContaining({
        base64: 'data:image/png;base64,...',
        format: 'png',
        paths: [],
        ideaID: 'idea123',
      })
    );
  });

  it ('should update an idea without fully updating everything', async () => {
    prismaMock.idea.update.mockResolvedValue({
        ideaID: 'idea123',
        name: 'Updated Idea',
        content: 'Updated content',
        userID: 'user123',
        categories: [],
        tags: ['Red'],
    });

    const result = await ideaService.updateIdea('idea123', {
        name: 'Updated Idea',
        content: 'Updated content',
    });

    expect(prismaMock.idea.update).toHaveBeenCalled();
    expect(result.name).toBe('Updated Idea');
  });
});
