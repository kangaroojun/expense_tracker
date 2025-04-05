// services/image.service.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class ImageService {
  async createSketch(base64: string, format: string = 'png') {
    return await prisma.image.create({
      data: {
        data: base64,
        format,
      },
    });
  }

  async updateSketch(imageID: string, base64: string) {
    return await prisma.image.update({
      where: { imageID },
      data: {
        data: base64,
      },
    });
  }
}
