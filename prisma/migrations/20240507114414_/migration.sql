/*
  Warnings:

  - You are about to drop the column `flightId` on the `Performance` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[performanceId]` on the table `Performance` will be added. If there are existing duplicate values, this will fail.
  - The required column `performanceId` was added to the `Performance` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "Performance_flightId_key";

-- AlterTable
ALTER TABLE "Performance" DROP COLUMN "flightId",
ADD COLUMN     "performanceId" TEXT NOT NULL,
ALTER COLUMN "duration" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Performance_performanceId_key" ON "Performance"("performanceId");
