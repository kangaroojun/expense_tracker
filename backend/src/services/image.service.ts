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
          ideas: {
            connect: { ideaID: data.ideaID },
          },
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
