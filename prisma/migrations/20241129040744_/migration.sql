/*
  Warnings:

  - You are about to drop the `Circuit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Circuit";

-- CreateTable
CREATE TABLE "circuit" (
    "id" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "userId" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "circuit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "circuit_userId_key" ON "circuit"("userId");
