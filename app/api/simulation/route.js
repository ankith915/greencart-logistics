// api/simulation/route.js
import prisma from '@/lib/prisma';
import { verifyRequest } from '../_utils/auth';

// Helpers from the spec (Page 4-6 of the PDF): penalties/bonus/fuel/profit/efficiency.

export async function POST(req) {
  try { verifyRequest(req); } catch { return Response.json({ error: 'Unauthorized' }, { status: 401 }); }

  const { numDrivers, startTime, maxHours } = await req.json();
  if (!numDrivers || !startTime || !maxHours || numDrivers < 1 || maxHours < 1) {
    return Response.json({ error: 'Invalid inputs' }, { status: 400 });
  }

  // Get top 'numDrivers' by shiftHours (you can adjust this heuristic)
  const drivers = await prisma.driver.findMany({ orderBy: { shiftHours: 'desc' }, take: Number(numDrivers) });
  if (drivers.length < numDrivers) return Response.json({ error: 'Not enough drivers' }, { status: 400 });

  const orders = await prisma.order.findMany({ orderBy: { valueRs: 'desc' } });
  const routes = await prisma.route.findMany();
  const routeMap = new Map(routes.map(r => [r.routeId, r]));

  // Per-driver state
  const driverStates = drivers.map(d => ({
    id: d.id,
    // Fatigue: if last day > 8 hours → speed -30% → time + ~42.857% ; to stay aligned with original, use 1/0.7 multiplier.
    factor: (d.pastWeekHours?.[d.pastWeekHours.length - 1] ?? 0) > 8 ? (1 / 0.7) : 1,
    currentHours: 0,
    assigned: []
  }));

  const unassigned = [];

  // Greedy assignment by least hours used that won’t exceed maxHours
  for (const order of orders) {
    const r = routeMap.get(order.routeId);
    if (!r) continue;

    const candidates = driverStates
      .filter(ds => ds.currentHours + ((r.baseTimeMin * ds.factor) / 60) <= maxHours)
      .sort((a, b) => a.currentHours - b.currentHours);

    if (candidates.length === 0) {
      unassigned.push(order);
    } else {
      const chosen = candidates[0];
      chosen.assigned.push(order);
      chosen.currentHours += (r.baseTimeMin * chosen.factor) / 60;
    }
  }

  // Tally
  let totalProfit = 0;
  let onTime = 0;
  let late = 0;
  let fuelCosts = 0;
  let fuelHigh = 0;
  let fuelMedium = 0;
  let fuelLow = 0;

  const processOrder = (order, factor = 1, assigned = true) => {
    const r = routeMap.get(order.routeId);
    if (!r) return;

    // Fuel cost
    let perKm = 5 + (r.trafficLevel === 'High' ? 2 : 0);
    let fuel = r.distanceKm * perKm;
    fuelCosts += fuel;

    if (r.trafficLevel === 'High') fuelHigh += fuel;
    else if (r.trafficLevel === 'Medium') fuelMedium += fuel;
    else fuelLow += fuel;

    if (!assigned) {
      // Unassigned → force penalty as “late/missed”
      totalProfit -= 50;
      late++;
      return;
    }

    // Late if (actual > base + 10)
    const actualMin = r.baseTimeMin * factor;
    const isLate = actualMin > (r.baseTimeMin + 10);
    const penalty = isLate ? 50 : 0;

    // Bonus if high value and on time
    const bonus = (!isLate && order.valueRs > 1000) ? 0.10 * order.valueRs : 0;

    // Profit
    totalProfit += order.valueRs + bonus - penalty - fuel;

    if (isLate) late++;
    else onTime++;
  };

  driverStates.forEach(ds => ds.assigned.forEach(o => processOrder(o, ds.factor, true)));
  unassigned.forEach(o => processOrder(o, 1, false));

  const efficiencyScore = orders.length ? (onTime / orders.length) * 100 : 0;

  const saved = await prisma.simulation.create({
    data: {
      numDrivers: Number(numDrivers),
      startTime: String(startTime),
      maxHours: Number(maxHours),
      totalProfit,
      efficiencyScore,
      onTime,
      late,
      fuelCosts,
      fuelHigh,
      fuelMedium,
      fuelLow
    }
  });

  return Response.json({
    totalProfit,
    efficiencyScore,
    onTime,
    late,
    fuelCosts,
    fuelHigh,
    fuelMedium,
    fuelLow,
    id: saved.id
  });
}

export async function GET(req) {
  try { verifyRequest(req); } catch { return Response.json({ error: 'Unauthorized' }, { status: 401 }); }
  const sims = await prisma.simulation.findMany({ orderBy: { timestamp: 'desc' } });
  return Response.json(sims);
}
