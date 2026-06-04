ALTER TYPE "VehicleType" ADD VALUE IF NOT EXISTS 'PHEV';

ALTER TABLE "Vehicle"
ADD COLUMN IF NOT EXISTS "brand" TEXT NOT NULL DEFAULT 'Outro';

ALTER TABLE "Vehicle"
ADD COLUMN IF NOT EXISTS "year" TEXT NOT NULL DEFAULT '2023';

ALTER TABLE "Vehicle"
ADD COLUMN IF NOT EXISTS "batteryCapacityKwh" DOUBLE PRECISION NOT NULL DEFAULT 75;

UPDATE "Vehicle"
SET "type" = 'PHEV'
WHERE "type" = 'HYBRID';

UPDATE "Vehicle"
SET "brand" = 'Tesla'
WHERE "brand" = 'Outro'
  AND "model" ILIKE '%Tesla%';

UPDATE "Vehicle"
SET "brand" = 'BYD'
WHERE "brand" = 'Outro'
  AND "model" ILIKE '%BYD%';
