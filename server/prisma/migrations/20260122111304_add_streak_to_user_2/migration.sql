/*
  Warnings:

  - You are about to drop the column `streak` on the `habits` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "habits" DROP COLUMN "streak";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "streak" INTEGER NOT NULL DEFAULT 0;
