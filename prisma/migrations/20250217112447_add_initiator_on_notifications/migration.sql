/*
  Warnings:

  - You are about to drop the column `userId` on the `Notifications` table. All the data in the column will be lost.
  - Added the required column `initiatorId` to the `Notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientId` to the `Notifications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Notifications" DROP CONSTRAINT "Notifications_userId_fkey";

-- DropIndex
DROP INDEX "Notifications_isRead_userId_idx";

-- DropIndex
DROP INDEX "Notifications_userId_createdAt_idx";

-- AlterTable
ALTER TABLE "Notifications" DROP COLUMN "userId",
ADD COLUMN     "initiatorId" INTEGER NOT NULL,
ADD COLUMN     "recipientId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Notifications_recipientId_createdAt_idx" ON "Notifications"("recipientId", "createdAt");

-- CreateIndex
CREATE INDEX "Notifications_isRead_recipientId_idx" ON "Notifications"("isRead", "recipientId");

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_initiatorId_fkey" FOREIGN KEY ("initiatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
