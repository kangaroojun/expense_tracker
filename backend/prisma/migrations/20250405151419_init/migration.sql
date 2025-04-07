/*
  Warnings:

  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `CategoryID` on the `Category` table. All the data in the column will be lost.
  - The required column `categoryID` was added to the `Category` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "_IdeaCategories" DROP CONSTRAINT "_IdeaCategories_A_fkey";

-- AlterTable
ALTER TABLE "Category" DROP CONSTRAINT "Category_pkey",
DROP COLUMN "CategoryID",
ADD COLUMN     "categoryID" TEXT NOT NULL,
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("categoryID");

-- AddForeignKey
ALTER TABLE "_IdeaCategories" ADD CONSTRAINT "_IdeaCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("categoryID") ON DELETE CASCADE ON UPDATE CASCADE;
