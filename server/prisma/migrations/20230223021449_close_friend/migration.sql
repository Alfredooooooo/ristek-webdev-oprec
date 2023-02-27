/*
  Warnings:

  - A unique constraint covering the columns `[userEmail,friendEmail]` on the table `CloseFriend` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CloseFriend_friendEmail_key";

-- CreateIndex
CREATE UNIQUE INDEX "CloseFriend_userEmail_friendEmail_key" ON "CloseFriend"("userEmail", "friendEmail");

-- AddForeignKey
ALTER TABLE "CloseFriend" ADD CONSTRAINT "CloseFriend_friendEmail_fkey" FOREIGN KEY ("friendEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
