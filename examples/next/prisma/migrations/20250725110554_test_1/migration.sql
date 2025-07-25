/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Todo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[titleHash]` on the table `Todo` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Todo" ADD COLUMN "titleHash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Todo_title_key" ON "Todo"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Todo_titleHash_key" ON "Todo"("titleHash");
