/*
  Warnings:

  - Made the column `refreshToken` on table `UserOauth` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UserOauth" ALTER COLUMN "refreshToken" SET NOT NULL;
