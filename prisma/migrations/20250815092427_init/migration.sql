-- CreateEnum
CREATE TYPE "public"."TrafficLevel" AS ENUM ('High', 'Medium', 'Low');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Driver" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "shiftHours" INTEGER NOT NULL,
    "pastWeekHours" INTEGER[],

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Route" (
    "id" SERIAL NOT NULL,
    "routeId" INTEGER NOT NULL,
    "distanceKm" DOUBLE PRECISION NOT NULL,
    "trafficLevel" "public"."TrafficLevel" NOT NULL,
    "baseTimeMin" INTEGER NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Order" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "valueRs" INTEGER NOT NULL,
    "deliveryTime" TEXT NOT NULL,
    "routeId" INTEGER NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Simulation" (
    "id" SERIAL NOT NULL,
    "numDrivers" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "maxHours" INTEGER NOT NULL,
    "totalProfit" DOUBLE PRECISION NOT NULL,
    "efficiencyScore" DOUBLE PRECISION NOT NULL,
    "onTime" INTEGER NOT NULL,
    "late" INTEGER NOT NULL,
    "fuelCosts" DOUBLE PRECISION NOT NULL,
    "fuelHigh" DOUBLE PRECISION NOT NULL,
    "fuelMedium" DOUBLE PRECISION NOT NULL,
    "fuelLow" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Simulation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Route_routeId_key" ON "public"."Route"("routeId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderId_key" ON "public"."Order"("orderId");

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "public"."Route"("routeId") ON DELETE CASCADE ON UPDATE CASCADE;
