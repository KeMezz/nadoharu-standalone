/*
  Warnings:

  - You are about to drop the `_ChatRoomToUser` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[initiatorId,recipientId]` on the table `ChatRoom` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `initiatorId` to the `ChatRoom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientId` to the `ChatRoom` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ChatRoomToUser" DROP CONSTRAINT "_ChatRoomToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChatRoomToUser" DROP CONSTRAINT "_ChatRoomToUser_B_fkey";

-- AlterTable
ALTER TABLE "ChatRoom" ADD COLUMN     "initiatorId" INTEGER NOT NULL,
ADD COLUMN     "recipientId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_ChatRoomToUser";

-- CreateIndex
CREATE UNIQUE INDEX "ChatRoom_initiatorId_recipientId_key" ON "ChatRoom"("initiatorId", "recipientId");

-- AddForeignKey
ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_initiatorId_fkey" FOREIGN KEY ("initiatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
