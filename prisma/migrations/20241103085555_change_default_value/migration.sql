-- AlterTable
ALTER TABLE "admins" ALTER COLUMN "isDeleted" SET DEFAULT false;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'PATIENT',
ALTER COLUMN "status" SET DEFAULT 'ACTIVE',
ALTER COLUMN "needPasswordChange" SET DEFAULT true;
