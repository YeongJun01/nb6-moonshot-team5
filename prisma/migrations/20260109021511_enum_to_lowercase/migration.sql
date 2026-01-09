/*
  Warnings:

  - The values [PENDING,ACCEPTED,REJECTED] on the enum `InvitationStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [MEMBER,OWNER] on the enum `MemberRole` will be removed. If these variants are still used in the database, this will fail.
  - The values [TODO,IN_PROGRESS] on the enum `TaskStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InvitationStatus_new" AS ENUM ('pending', 'accepted', 'rejected');
ALTER TABLE "Invitation" ALTER COLUMN "status" TYPE "InvitationStatus_new" USING ("status"::text::"InvitationStatus_new");
ALTER TYPE "InvitationStatus" RENAME TO "InvitationStatus_old";
ALTER TYPE "InvitationStatus_new" RENAME TO "InvitationStatus";
DROP TYPE "InvitationStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "MemberRole_new" AS ENUM ('member', 'owner');
ALTER TABLE "ProjectMember" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "ProjectMember" ALTER COLUMN "role" TYPE "MemberRole_new" USING ("role"::text::"MemberRole_new");
ALTER TYPE "MemberRole" RENAME TO "MemberRole_old";
ALTER TYPE "MemberRole_new" RENAME TO "MemberRole";
DROP TYPE "MemberRole_old";
ALTER TABLE "ProjectMember" ALTER COLUMN "role" SET DEFAULT 'member';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TaskStatus_new" AS ENUM ('todo', 'in_progress', 'DONE');
ALTER TABLE "Task" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "SubTask" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Task" ALTER COLUMN "status" TYPE "TaskStatus_new" USING ("status"::text::"TaskStatus_new");
ALTER TABLE "SubTask" ALTER COLUMN "status" TYPE "TaskStatus_new" USING ("status"::text::"TaskStatus_new");
ALTER TYPE "TaskStatus" RENAME TO "TaskStatus_old";
ALTER TYPE "TaskStatus_new" RENAME TO "TaskStatus";
DROP TYPE "TaskStatus_old";
ALTER TABLE "Task" ALTER COLUMN "status" SET DEFAULT 'todo';
ALTER TABLE "SubTask" ALTER COLUMN "status" SET DEFAULT 'todo';
COMMIT;

-- AlterTable
ALTER TABLE "ProjectMember" ALTER COLUMN "role" SET DEFAULT 'member';

-- AlterTable
ALTER TABLE "SubTask" ALTER COLUMN "status" SET DEFAULT 'todo';

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "status" SET DEFAULT 'todo';
