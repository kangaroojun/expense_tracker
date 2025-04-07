/*
  Warnings:

  - You are about to drop the column `imageID` on the `Idea` table. All the data in the column will be lost.
  - Added the required column `ideaID` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Idea" DROP CONSTRAINT "Idea_imageID_fkey";

-- AlterTable
ALTER TABLE "Idea" DROP COLUMN "imageID";

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "ideaID" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_ideaID_fkey" FOREIGN KEY ("ideaID") REFERENCES "Idea"("ideaID") ON DELETE RESTRICT ON UPDATE CASCADE;
