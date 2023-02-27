/*
  Warnings:

  - Added the required column `friendEmail` to the `CloseFriend` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CloseFriend" ADD COLUMN     "friendEmail" TEXT NOT NULL;
