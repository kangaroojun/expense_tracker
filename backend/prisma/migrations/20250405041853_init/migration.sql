/*
  Warnings:

  - You are about to drop the column `username` on the `Account` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Account_username_key";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "username";
