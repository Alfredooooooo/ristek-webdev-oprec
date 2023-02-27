/*
  Warnings:

  - A unique constraint covering the columns `[friendEmail]` on the table `CloseFriend` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CloseFriend_friendEmail_key" ON "CloseFriend"("friendEmail");
