/*
  Warnings:

  - The primary key for the `circuit` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `circuit` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "circuit" DROP CONSTRAINT "circuit_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "circuit_pkey" PRIMARY KEY ("id");
