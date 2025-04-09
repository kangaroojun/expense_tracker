// __tests__/image.service.test.ts
import { ImageService } from '../src/services/image.service';
import { CanvasPath } from 'react-sketch-canvas';
import prismaMock from '../__mocks__/prismaClient';

jest.mock('@prisma/client', () => {
  const actual = jest.requireActual('@prisma/client');
  return {
    ...actual,
    PrismaClient: jest.fn(() => prismaMock),
  };
});

describe('ImageService', () => {
  const imageService = new ImageService();
  const mockCanvasPaths: CanvasPath[] = [
    {
      paths: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
      strokeWidth: 2,
      strokeColor: '#000000',
      drawMode: true,
      startTimestamp: Date.now(),
      endTimestamp: Date.now() + 1000,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a sketch image', async () => {
    prismaMock.image.create.mockResolvedValue({} as any);

    await expect(
      imageService.createSketch({
        paths: mockCanvasPaths,
        base64: 'data:image/png;base64,...',
        format: 'png',
        ideaID: 'idea123',
      })
    ).resolves.not.toThrow();

    expect(prismaMock.image.create).toHaveBeenCalled();
  });

  it('should return image base64 and format', async () => {
    prismaMock.image.findUnique.mockResolvedValue({
      imageID: 'img123',
      data: { base64: 'data:image/png;base64,...', format: 'png' },
      format: 'png',
      createdAt: new Date(),
    } as any);

    const result = await imageService.getImageOnly('img123');
    expect(result.base64).toBe('data:image/png;base64,...');
    expect(result.format).toBe('png');
  });

  it('should throw error if image is not found (getImageOnly)', async () => {
    prismaMock.image.findUnique.mockResolvedValue(null);

    await expect(imageService.getImageOnly('img123')).rejects.toThrow('Image not found');
  });

  it('should return image with paths, base64, format', async () => {
    prismaMock.image.findUnique.mockResolvedValue({
      imageID: 'img123',
      data: {
        paths: [],
        base64: 'data:image/png;base64,...',
      },
      format: 'png',
      createdAt: new Date(),
    } as any);

    const result = await imageService.getImageWithPaths('img123');
    expect(result.base64).toBe('data:image/png;base64,...');
    expect(result.paths).toEqual([]);
    expect(result.format).toBe('png');
  });

  it('should throw error if image is not found (getImageWithPaths)', async () => {
    prismaMock.image.findUnique.mockResolvedValue(null);
    await expect(imageService.getImageWithPaths('img123')).rejects.toThrow('Image not found');
  });

  it('should update a sketch image', async () => {
    prismaMock.image.update.mockResolvedValue({} as any);

    await expect(
      imageService.updateSketch('img123', {
        paths: [],
        base64: 'data:image/png;base64,...',
        format: 'png',
      })
    ).resolves.not.toThrow();

    expect(prismaMock.image.update).toHaveBeenCalled();
  });

  it('should delete a sketch image', async () => {
    prismaMock.image.delete.mockResolvedValue({} as any);

    await expect(imageService.deleteSketch('img123')).resolves.not.toThrow();
    expect(prismaMock.image.delete).toHaveBeenCalledWith({
      where: { imageID: 'img123' },
    });
  });
});
