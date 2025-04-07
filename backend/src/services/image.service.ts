// services/image.service.ts
import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class ImageService {
  async createSketch(data: {
    paths: CanvasPath[];
    base64: string;
    format: string;
    ideaID: string;
  }) {
    const imageData = {
      paths: data.paths,
      base64: data.base64,
    };
    
    const safeJson = imageData as unknown as Prisma.InputJsonValue;
    
    await prisma.image.create({
      data: {
        data: safeJson,
        format: data.format,
        idea: {
          connect: { ideaID: data.ideaID },
        },
      },
    });
  }

  async getImageOnly(imageID: string) {
    const image = await prisma.image.findUnique({
      where: { imageID },
    });

    if (!image || image.data === null || typeof image.data !== 'object') {
      throw new Error('Image not found');
    }

    const imageData = image.data as any;
    
    return {
      base64: imageData.base64,
      format: imageData.format,
    };
  }

  async getImageWithPaths(imageID: string) {
    const image = await prisma.image.findUnique({
      where: { imageID },
    });

    if (!image || image.data === null || typeof image.data !== 'object') {
      throw new Error('Image not found');
    }

    const imageData = image.data as any;
    
    return {
      paths: imageData.paths,
      base64: imageData.base64,
      format: image.format,
    };
  }

  async updateSketch(
    imageID: string, 
    data: {
      paths: CanvasPath[];
      base64: string;
      format: string;
    }) {

    const imageData = {
      paths: data.paths,
      base64: data.base64,
    };
    
    const safeJson = imageData as unknown as Prisma.InputJsonValue;
    
    await prisma.image.update({
      where: { imageID },
      data: {
        data: safeJson,
        format: data.format,
      },
    });
  }

  async deleteSketch(imageID: string) {
    await prisma.image.delete({
      where: { imageID },
    });
  }
}
