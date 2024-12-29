/*
  Warnings:

  - You are about to drop the column `cover` on the `circuit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "circuit" DROP COLUMN "cover",
ADD COLUMN     "thumbnail" TEXT;
