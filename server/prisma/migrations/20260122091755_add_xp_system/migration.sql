-- AlterTable
ALTER TABLE "goals" ADD COLUMN     "xpReward" INTEGER NOT NULL DEFAULT 100;

-- AlterTable
ALTER TABLE "habits" ALTER COLUMN "xpReward" SET DEFAULT 20;
