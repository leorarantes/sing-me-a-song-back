/*
  Warnings:

  - You are about to drop the `recommendation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "recommendation";

-- CreateTable
CREATE TABLE "recommendations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "youtubeLink" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "recommendations_name_key" ON "recommendations"("name");
