/*
  Warnings:

  - Added the required column `category` to the `habits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `frequency` to the `habits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `habits` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "habits" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "frequency" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
