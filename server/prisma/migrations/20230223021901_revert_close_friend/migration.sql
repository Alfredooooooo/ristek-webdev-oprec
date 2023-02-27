/*
  Warnings:

  - You are about to drop the `CloseFriend` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CloseFriend" DROP CONSTRAINT "CloseFriend_friendEmail_fkey";

-- DropForeignKey
ALTER TABLE "CloseFriend" DROP CONSTRAINT "CloseFriend_userEmail_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "closeFriend" TEXT[];

-- DropTable
DROP TABLE "CloseFriend";
