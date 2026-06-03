-- CreateEnum
CREATE TYPE "ChargingSessionStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Vehicle" ALTER COLUMN "nickname" SET DEFAULT 'Meu veículo',
ALTER COLUMN "plate" SET DEFAULT 'ABC1D23';

-- CreateTable
CREATE TABLE "ChargingSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,
    "chargerId" TEXT NOT NULL,
    "status" "ChargingSessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "selectedMinutes" INTEGER NOT NULL,
    "pricePerMinute" DOUBLE PRECISION NOT NULL,
    "estimatedCost" DOUBLE PRECISION NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChargingSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChargingSession_userId_idx" ON "ChargingSession"("userId");

-- CreateIndex
CREATE INDEX "ChargingSession_stationId_idx" ON "ChargingSession"("stationId");

-- CreateIndex
CREATE INDEX "ChargingSession_chargerId_idx" ON "ChargingSession"("chargerId");

-- CreateIndex
CREATE INDEX "ChargingSession_status_idx" ON "ChargingSession"("status");

-- AddForeignKey
ALTER TABLE "ChargingSession" ADD CONSTRAINT "ChargingSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChargingSession" ADD CONSTRAINT "ChargingSession_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChargingSession" ADD CONSTRAINT "ChargingSession_chargerId_fkey" FOREIGN KEY ("chargerId") REFERENCES "Charger"("id") ON DELETE CASCADE ON UPDATE CASCADE;
