// services/idea.service.ts
import { PrismaClient } from '@prisma/client';
import { ImageService } from './image.service';
const prisma = new PrismaClient();

export class IdeaService {
  private imageService = new ImageService();

  async createIdea(data: {
    name: string;
    content: string;
    userID: string;
    categories: string[]; // array of category IDs
    tags: string[];       // enums as strings
    sketchBase64?: string;
  }) {
    let image = null;

    if (data.sketchBase64) {
      image = await this.imageService.createSketch(data.sketchBase64);
    }

    return await prisma.idea.create({
      data: {
        name: data.name,
        content: data.content,
        userID: data.userID,
        imageID: image?.imageID || undefined,
        categories: {
          connect: data.categories.map(id => ({ id })),
        },
        tags: data.tags as any, // Prisma enums
      },
    });
  }

  async updateIdea(ideaID: string, updates: Partial<{ name: string; content: string }>) {
    return await prisma.idea.update({
      where: { ideaID },
      data: updates,
    });
  }
}
