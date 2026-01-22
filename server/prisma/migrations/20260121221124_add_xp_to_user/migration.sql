/*
  Warnings:

  - You are about to drop the column `stepId` on the `habit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `habits` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "habit_logs" DROP CONSTRAINT "habit_logs_stepId_fkey";

-- DropIndex
DROP INDEX "habit_logs_habitId_date_key";

-- AlterTable
ALTER TABLE "habit_logs" DROP COLUMN "stepId",
ADD COLUMN     "habitStepId" TEXT;

-- AlterTable
ALTER TABLE "habits" DROP COLUMN "name",
ADD COLUMN     "xpReward" INTEGER NOT NULL DEFAULT 10,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "xp" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "habit_logs" ADD CONSTRAINT "habit_logs_habitStepId_fkey" FOREIGN KEY ("habitStepId") REFERENCES "habit_steps"("id") ON DELETE SET NULL ON UPDATE CASCADE;
