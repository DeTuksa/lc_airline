/*
  Warnings:

  - You are about to drop the `Flight` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Seat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SeatingPlan` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[flightId]` on the table `Performance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `flight` to the `Performance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Flight" DROP CONSTRAINT "Flight_seatingPlanId_fkey";

-- DropForeignKey
ALTER TABLE "Performance" DROP CONSTRAINT "Performance_flightId_fkey";

-- DropForeignKey
ALTER TABLE "Seat" DROP CONSTRAINT "Seat_seatingplanId_fkey";

-- AlterTable
ALTER TABLE "Performance" ADD COLUMN     "flight" JSONB NOT NULL,
ALTER COLUMN "flightId" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Flight";

-- DropTable
DROP TABLE "Seat";

-- DropTable
DROP TABLE "SeatingPlan";

-- CreateIndex
CREATE UNIQUE INDEX "Performance_flightId_key" ON "Performance"("flightId");
