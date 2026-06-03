/*
  Warnings:

  - Added the required column `nickname` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plate` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('EV', 'HYBRID');

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "feeling" TEXT,
ADD COLUMN     "sparksEarned" INTEGER NOT NULL DEFAULT 30;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "reviewsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sparks" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "currentBatteryPercent" INTEGER NOT NULL DEFAULT 80,
ADD COLUMN     "fuelBackup" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "nickname" TEXT NOT NULL,
ADD COLUMN     "plate" TEXT NOT NULL,
ADD COLUMN     "type" "VehicleType" NOT NULL DEFAULT 'EV';

-- CreateIndex
CREATE INDEX "Charger_stationId_idx" ON "Charger"("stationId");

-- CreateIndex
CREATE INDEX "ChargingHistory_userId_idx" ON "ChargingHistory"("userId");

-- CreateIndex
CREATE INDEX "ChargingHistory_stationId_idx" ON "ChargingHistory"("stationId");

-- CreateIndex
CREATE INDEX "Favorite_userId_idx" ON "Favorite"("userId");

-- CreateIndex
CREATE INDEX "Favorite_stationId_idx" ON "Favorite"("stationId");

-- CreateIndex
CREATE INDEX "Review_userId_idx" ON "Review"("userId");

-- CreateIndex
CREATE INDEX "Review_stationId_idx" ON "Review"("stationId");

-- CreateIndex
CREATE INDEX "Vehicle_userId_idx" ON "Vehicle"("userId");
