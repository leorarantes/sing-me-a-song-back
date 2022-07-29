/*
  Warnings:

  - You are about to drop the `recommendations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "recommendations";

-- CreateTable
CREATE TABLE "recommendation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "youtubeLink" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "recommendation_name_key" ON "recommendation"("name");
