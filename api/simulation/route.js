import connectDB from '../../lib/db';
import Driver from '../../models/Driver';
import Route from '../../models/Route';
import Order from '../../models/Order';
import Simulation from '../../models/Simulation';
import jwt from 'jsonwebtoken';

// Simple in-memory cache (bonus)
const cache = new Map();

function verifyToken(req) {
  const token = req.headers.get('authorization')?.split(' ')[1] || req.cookies.get('token')?.value;
  if (!token) throw new Error('No token');
  return jwt.verify(token, process.env.JWT_SECRET);
}

export async function POST(req) {
  try {
    verifyToken(req);
  } catch {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  await connectDB();
  const { numDrivers, startTime, maxHours } = await req.json();
  if (!numDrivers || !startTime || !maxHours || numDrivers < 1 || maxHours < 1) {
    return new Response(JSON.stringify({ error: 'Invalid inputs' }), { status: 400 });
  }
  const drivers = await Driver.find().sort({ shift_hours: -1 }).limit(numDrivers);
  if (drivers.length < numDrivers) {
    return new Response(JSON.stringify({ error: 'Not enough drivers' }), { status: 400 });
  }
  const orders = await Order.find().sort({ value_rs: -1 });
  const routes = await Route.find();
  const routeMap = new Map(routes.map(r => [r.route_id, r]));

  const driverStates = drivers.map(d => ({
    id: d._id,
    factor: d.past_week_hours.at(-1) > 8 ? 1 / 0.7 : 1,  // Time multiplier for fatigue
    currentHours: 0,
    assigned: [],
  }));

  let unassigned = [];
  for (const order of orders) {
    const route = routeMap.get(order.route_id);
    if (!route) continue;
    const timeHours = (route.base_time_min * driverStates[0].factor) / 60;  // Example, but adjust per driver
    let candidates = driverStates.filter(ds => ds.currentHours + (route.base_time_min * ds.factor / 60) <= maxHours);
    candidates.sort((a, b) => a.currentHours - b.currentHours);
    if (candidates.length > 0) {
      const chosen = candidates[0];
      chosen.assigned.push(order);
      chosen.currentHours += route.base_time_min * chosen.factor / 60;
    } else {
      unassigned.push(order);
    }
  }

  let totalProfit = 0;
  let onTime = 0;
  let late = 0;
  let fuelCosts = 0;
  let fuelHigh = 0;
  let fuelMedium = 0;
  let fuelLow = 0;

  const processOrder = (order, factor = 1, assigned = true) => {
    const route = routeMap.get(order.route_id);
    if (!route) return;
    let fuel = route.distance_km * 5;
    if (route.traffic_level === 'High') {
      fuel += route.distance_km * 2;
      fuelHigh += fuel;
    } else if (route.traffic_level === 'Medium') {
      fuelMedium += fuel;
    } else {
      fuelLow += fuel;
    }
    fuelCosts += fuel;
    if (!assigned) {
      totalProfit -= 50;
      late++;
      return;
    }
    const calcTime = route.base_time_min * factor;
    const isLate = calcTime > route.base_time_min + 10;
    const penalty = isLate ? 50 : 0;
    const bonus = (order.value_rs > 1000 && !isLate) ? 0.1 * order.value_rs : 0;
    totalProfit += order.value_rs + bonus - penalty - fuel;
    isLate ? late++ : onTime++;
  };

  driverStates.forEach(ds => ds.assigned.forEach(o => processOrder(o, ds.factor)));
  unassigned.forEach(o => processOrder(o, 1, false));

  const efficiencyScore = (onTime / orders.length) * 100;

  const sim = new Simulation({
    numDrivers, startTime, maxHours, totalProfit, efficiencyScore, onTime, late, fuelCosts, fuelHigh, fuelMedium, fuelLow,
  });
  await sim.save();

  // Cache latest
  cache.set('latest', { totalProfit, efficiencyScore, onTime, late, fuelCosts, fuelHigh, fuelMedium, fuelLow });

  return Response.json(cache.get('latest'));
}

export async function GET(req) {
  try {
    verifyToken(req);
  } catch {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  await connectDB();
  const simulations = await Simulation.find().sort({ timestamp: -1 });
  return Response.json(simulations);
}