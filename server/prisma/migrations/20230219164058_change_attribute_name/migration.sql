/*
  Warnings:

  - You are about to drop the column `email` on the `Tokens` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `User` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Tokens` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TokenStatus" AS ENUM ('DISABLED', 'ENABLED');

-- DropForeignKey
ALTER TABLE "Tokens" DROP CONSTRAINT "Tokens_email_fkey";

-- DropIndex
DROP INDEX "Tokens_email_key";

-- AlterTable
ALTER TABLE "Tokens" DROP COLUMN "email",
ADD COLUMN     "tokenStatus" "TokenStatus" NOT NULL DEFAULT 'ENABLED',
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "token",
ADD COLUMN     "currentToken" TEXT;

-- AddForeignKey
ALTER TABLE "Tokens" ADD CONSTRAINT "Tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
