-- AlterTable
ALTER TABLE "prescriptions" ALTER COLUMN "instructions" DROP NOT NULL,
ALTER COLUMN "followUpDate" DROP NOT NULL;
