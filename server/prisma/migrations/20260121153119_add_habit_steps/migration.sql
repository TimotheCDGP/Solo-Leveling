-- AlterTable
ALTER TABLE "habits" ADD COLUMN     "currentStreak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isCompletedToday" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastCompletedAt" TIMESTAMP(3),
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "frequency" SET DEFAULT 'DAILY';

-- CreateTable
CREATE TABLE "habit_steps" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "habitId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "habit_steps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "habit_steps_habitId_idx" ON "habit_steps"("habitId");

-- AddForeignKey
ALTER TABLE "habit_steps" ADD CONSTRAINT "habit_steps_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "habits"("id") ON DELETE CASCADE ON UPDATE CASCADE;
