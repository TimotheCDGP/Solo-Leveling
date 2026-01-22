/*
  Warnings:

  - Added the required column `goalId` to the `steps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "steps" ADD COLUMN     "goalId" TEXT NOT NULL,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "steps" ADD CONSTRAINT "steps_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
