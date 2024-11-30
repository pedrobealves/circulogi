/*
  Warnings:

  - You are about to drop the column `userId` on the `circuit` table. All the data in the column will be lost.
  - Added the required column `name` to the `circuit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `circuit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `version` to the `circuit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "circuit" DROP COLUMN "userId",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "user_id" UUID NOT NULL,
ADD COLUMN     "version" TEXT NOT NULL;
