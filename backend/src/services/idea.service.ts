// services/idea.service.ts
import { PrismaClient, Tag } from '@prisma/client';
import { ImageService } from './image.service';
const prisma = new PrismaClient();

export class IdeaService {
  constructor(private imageService = new ImageService()) {}

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
          connectOrCreate: data.categories.map(desc => ({
            where: { description: desc },
            create: { description: desc },
          }))
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

    return {
      ...newIdea,
      image,
    };
  }

  async updateIdea(
    ideaID: string, 
    updates: Partial<{
      name: string;
      content: string;
      categories: string[];
      tags: string[];
    }>) {
    const updatedIdea = await prisma.idea.update({
      where: { ideaID },
      data: {
        name: updates.name,
        content: updates.content,
        categories: {
          connectOrCreate: updates.categories?.map(desc => ({
            where: { description: desc },
            create: { description: desc },
          })) || [],
        },
        tags: updates.tags?.map(tag => tag as Tag) || [],
      },
    });

    return {
      ...updatedIdea
    };
  }

  async getAllIdeasWithImages() {
    const ideas = await prisma.idea.findMany({
      include: {
        categories: true,
        image: true, // fetch the imageIDs related to each idea
      },
    });
  
    const results = [];
  
    for (const idea of ideas) {
      let images: ({ base64: string; format: string; } | null)[] = [];
  
      if (idea.image && idea.image.length > 0) {
        const imageFetches = await Promise.all(
          idea.image.map(async (img) => {
            try {
              return await this.imageService.getImageOnly(img.imageID);
            } catch {
              return null;
            }
          })
        );
        images = imageFetches.filter(Boolean); // remove any nulls
      }
  
      results.push({
        ...idea,
        images,
      });
    }
  
    return results;
  }

  async getIdeaWithSketch(ideaID: string) {
    const idea = await prisma.idea.findUnique({
      where: { ideaID },
      include: {
        image: true,
      },
    });

    if (!idea) {
      throw new Error('Idea not found');
    }

    let images: ({ paths: CanvasPath[]; base64: string; format: string; } | null)[] = [];

    if (idea.image && idea.image.length > 0) {
      // You can fetch image data one by one using imageService
      const imageFetches = await Promise.all(
        idea.image.map(async (img) => {
          try {
            return await this.imageService.getImageWithPaths(img.imageID);
          } catch {
            return null;
          }
        })
      );
      images = imageFetches.filter(Boolean); // remove any nulls
    }

    return {
      ...idea,
      images,
    };
  }

  async deleteIdea(ideaID: string) {
    await prisma.idea.delete({
      where: { ideaID },
    });

    const images = await prisma.image.findMany({
      where: { ideaID },
    });
  
    await Promise.all(
      images.map(async (img) => {
        try {
          await this.imageService.deleteSketch(img.imageID);
        } catch (err) {
          console.error(`Failed to delete image ${img.imageID}:`, err);
        }
      })
    );
  }
}
