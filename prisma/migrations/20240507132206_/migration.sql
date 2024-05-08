/*
  Warnings:

  - Added the required column `performanceId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `seats` on the `Booking` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "performanceId" INTEGER NOT NULL,
DROP COLUMN "seats",
ADD COLUMN     "seats" JSONB NOT NULL;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_performanceId_fkey" FOREIGN KEY ("performanceId") REFERENCES "Performance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
