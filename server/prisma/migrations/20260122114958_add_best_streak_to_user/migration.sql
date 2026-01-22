/*
  Warnings:

  - You are about to drop the column `streak` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "streak",
ADD COLUMN     "bestStreak" INTEGER NOT NULL DEFAULT 0;
