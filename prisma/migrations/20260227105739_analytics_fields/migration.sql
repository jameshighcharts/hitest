-- CreateEnum
CREATE TYPE "SessionValidity" AS ENUM ('pending', 'approved', 'rejected');

-- AlterEnum
ALTER TYPE "TestStatus" ADD VALUE 'closed';

-- AlterTable
ALTER TABLE "TaskResult" ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "TestSession" ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'prolific',
ADD COLUMN     "validity" "SessionValidity" NOT NULL DEFAULT 'pending';
