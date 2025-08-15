// prisma/seed.mjs
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'csv-parse/sync';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function readCsv(relPath) {
  const p = path.join(process.cwd(), relPath);
  const raw = fs.readFileSync(p, 'utf8');
  return parse(raw, { columns: true, skip_empty_lines: true, trim: true });
}

function toIntArray(pipeString) {
  if (!pipeString) return [];
  return pipeString.split('|').map(v => Number(v.trim())).filter(v => Number.isFinite(v));
}

async function main() {
  // Wipe in order of FKs
  await prisma.order.deleteMany();
  await prisma.route.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.simulation.deleteMany();
  await prisma.user.deleteMany();

  // Seed default manager user
  const hashed = await bcrypt.hash('password', 10);
  await prisma.user.create({ data: { username: 'admin', password: hashed } });

  // Drivers
  const driverRows = readCsv('data/drivers.csv');
  await prisma.driver.createMany({
    data: driverRows.map(r => ({
      name: r.name,
      shiftHours: Number(r.shift_hours),
      pastWeekHours: toIntArray(r.past_week_hours)
    }))
  });

  // Routes
  const routeRows = readCsv('data/routes.csv');
  await prisma.route.createMany({
    data: routeRows.map(r => ({
      routeId: Number(r.route_id),
      distanceKm: Number(r.distance_km),
      trafficLevel: r.traffic_level, // High | Medium | Low
      baseTimeMin: Number(r.base_time_min)
    }))
  });

  // Orders
  const orderRows = readCsv('data/orders.csv');
  await prisma.order.createMany({
    data: orderRows.map(r => ({
      orderId: Number(r.order_id),
      valueRs: Number(r.value_rs),
      routeId: Number(r.route_id),
      deliveryTime: String(r.delivery_time)
    }))
  });

  console.log('Seeding complete');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
