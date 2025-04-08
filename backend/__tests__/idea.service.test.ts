import prismaMock from '../__mocks__/prismaClient';
import { IdeaService } from '../src/services/idea.service';
// import { PrismaClient } from '@prisma/client';
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

  it ('should update the image if sketch data is provided', async () => {
    prismaMock.idea.update.mockResolvedValue({
        ideaID: 'idea123',
        name: 'Updated Idea',
        content: 'Updated content',
        userID: 'user123',
        categories: [],
        tags: ['Red'],

    });

    await ideaService.updateIdea('idea123', {
        imageID: 'image123',
        sketchBase64: 'data:image/png;base64,...',
        sketchFormat: 'png',
        paths: [],
    });

    expect(imageServiceMock.updateSketch).toHaveBeenCalledWith(
        'image123',
        expect.objectContaining({
          base64: 'data:image/png;base64,...',
          format: 'png',
          paths: [],
        })
      );      
  });

  it('should delete an idea and its associated image', async () => {
    prismaMock.idea.delete.mockResolvedValue({
      ideaID: 'idea123',
      name: 'Test Idea',
      content: 'Some content',
      userID: 'user123',
      categories: [],
      tags: ['Red'],
    });
  
    prismaMock.image.findMany.mockResolvedValue([
      { imageID: 'img123', data: {}, format: 'png', createdAt: new Date(), ideaID: 'idea123' }
    ]);
  
    await ideaService.deleteIdea('idea123');
  
    expect(prismaMock.idea.delete).toHaveBeenCalledWith({
      where: { ideaID: 'idea123' },
    });
  
    expect(prismaMock.image.findMany).toHaveBeenCalledWith({
      where: { ideaID: 'idea123' },
    });
  
    expect(imageServiceMock.deleteSketch).toHaveBeenCalledWith('img123');
  });

  it('should fetch all ideas with their images', async () => {
    prismaMock.idea.findMany.mockResolvedValue([
      {
        ideaID: 'idea123',
        name: 'Idea One',
        content: 'Content One',
        userID: 'user123',
        creationDate: new Date(),
        modificationDate: new Date(),
        categories: [],
        tags: ['Red'],
        image: [{ imageID: 'img123' }],
      },
    ]);
  
    imageServiceMock.getImageOnly.mockResolvedValue({
      base64: 'base64string',
      format: 'png',
    });
  
    const result = await ideaService.getAllIdeasWithImages();
  
    expect(prismaMock.idea.findMany).toHaveBeenCalledWith({
      include: {
        categories: true,
        image: true,
      },
    });
  
    expect(imageServiceMock.getImageOnly).toHaveBeenCalledWith('img123');
  
    expect(result[0].images).toEqual([
      {
        base64: 'base64string',
        format: 'png',
      },
    ]);
  
  });

  it('should fetch a specific idea with sketch data', async () => {
    prismaMock.idea.findUnique.mockResolvedValue({
      ideaID: 'idea123',
      name: 'Sketch Idea',
      content: 'Sketch content',
      userID: 'user123',
      creationDate: new Date(),
      modificationDate: new Date(),
      tags: ['Green'],
      categories: [],
      image: [{ imageID: 'img456' }],
    });
  
    imageServiceMock.getImageWithPaths.mockResolvedValue({
      paths: [{ paths: [], drawMode: true, strokeColor: 'black', strokeWidth: 5 }],
      base64: 'base64string',
      format: 'jpeg',
    });
  
    const result = await ideaService.getIdeaWithSketch('idea123');
  
    expect(prismaMock.idea.findUnique).toHaveBeenCalledWith({
      where: { ideaID: 'idea123' },
      include: { image: true },
    });
  
    expect(imageServiceMock.getImageWithPaths).toHaveBeenCalledWith('img456');
  
    expect(result.images).toEqual([
      {
        paths: [{ paths: [], drawMode: true, strokeColor: 'black', strokeWidth: 5 }],
        base64: 'base64string',
        format: 'jpeg',
      },
    ]);
  });  
  
});
