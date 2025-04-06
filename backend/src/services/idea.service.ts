// services/idea.service.ts
import { PrismaClient, Tag } from '@prisma/client';
import { ImageService } from './image.service';
const prisma = new PrismaClient();

export class IdeaService {
  private imageService = new ImageService();

  async createIdea(data: {
    userID: string;
    name: string;
    content: string;
    categories: string[]; // array of categories
    tags: string[];       // enums as strings
    paths?: CanvasPath[]; // optional, for sketch
    sketchBase64?: string;
    sketchFormat?: string;
  }) {
    const newIdea = await prisma.idea.create({
      data: {
        name: data.name,
        content: data.content,
        userID: data.userID,
        categories: { 
          connect: data.categories.map(desc => ({ description: desc })),
        },
        tags: data.tags.map(tag => tag as Tag),
      },
    });

    let image = null;

    if (data.paths && data.sketchBase64 && data.sketchFormat) {
      let imageData = {
        paths: data.paths,
        base64: data.sketchBase64,
        format: data.sketchFormat,
        ideaID: newIdea.ideaID,
      };
      image = await this.imageService.createSketch(imageData);
    }
  }

  async updateIdea(ideaID: string, updates: Partial<{ name: string; content: string }>) {
    return await prisma.idea.update({
      where: { ideaID },
      data: updates,
    });
  }

  async getAllIdeas() {
    return await prisma.idea.findMany();
  }
}
