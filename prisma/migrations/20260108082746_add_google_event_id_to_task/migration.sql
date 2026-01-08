/*
  Warnings:

  - A unique constraint covering the columns `[googleEventId]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "googleEventId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Task_googleEventId_key" ON "Task"("googleEventId");
