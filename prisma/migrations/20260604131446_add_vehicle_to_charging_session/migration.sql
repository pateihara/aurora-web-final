/*
  Warnings:

  - The values [HYBRID] on the enum `VehicleType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `fuelBackup` on the `Vehicle` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "VehicleType_new" AS ENUM ('EV', 'PHEV');
ALTER TABLE "public"."Vehicle" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Vehicle" ALTER COLUMN "type" TYPE "VehicleType_new" USING ("type"::text::"VehicleType_new");
ALTER TYPE "VehicleType" RENAME TO "VehicleType_old";
ALTER TYPE "VehicleType_new" RENAME TO "VehicleType";
DROP TYPE "public"."VehicleType_old";
ALTER TABLE "Vehicle" ALTER COLUMN "type" SET DEFAULT 'EV';
COMMIT;

-- AlterTable
ALTER TABLE "ChargingSession" ADD COLUMN     "vehicleId" TEXT;

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "fuelBackup";

-- CreateIndex
CREATE INDEX "ChargingSession_vehicleId_idx" ON "ChargingSession"("vehicleId");

-- AddForeignKey
ALTER TABLE "ChargingSession" ADD CONSTRAINT "ChargingSession_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
