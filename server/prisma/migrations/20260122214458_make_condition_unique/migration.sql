/*
  Warnings:

  - A unique constraint covering the columns `[condition]` on the table `badges` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "badges_condition_key" ON "badges"("condition");
