/*
  Warnings:

  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Category` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[description]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - The required column `CategoryID` was added to the `Category` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "_IdeaCategories" DROP CONSTRAINT "_IdeaCategories_A_fkey";

-- AlterTable
ALTER TABLE "Category" DROP CONSTRAINT "Category_pkey",
DROP COLUMN "id",
ADD COLUMN     "CategoryID" TEXT NOT NULL,
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("CategoryID");

-- CreateIndex
CREATE UNIQUE INDEX "Category_description_key" ON "Category"("description");

-- AddForeignKey
ALTER TABLE "_IdeaCategories" ADD CONSTRAINT "_IdeaCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("CategoryID") ON DELETE CASCADE ON UPDATE CASCADE;
