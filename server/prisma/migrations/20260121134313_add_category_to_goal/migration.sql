-- AlterTable
ALTER TABLE "goals" ADD COLUMN     "category" TEXT;

-- AlterTable
ALTER TABLE "steps" ALTER COLUMN "updatedAt" DROP DEFAULT;
