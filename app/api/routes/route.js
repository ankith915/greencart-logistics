// api/routes/route.js
import prisma from '@/lib/prisma';
import { verifyRequest } from '../_utils/auth';

export async function GET(req) {
  try { verifyRequest(req); } catch { return Response.json({ error: 'Unauthorized' }, { status: 401 }); }
  const routes = await prisma.route.findMany({ orderBy: { routeId: 'asc' } });
  return Response.json(routes);
}

export async function POST(req) {
  try { verifyRequest(req); } catch { return Response.json({ error: 'Unauthorized' }, { status: 401 }); }
  const { route_id, distance_km, traffic_level, base_time_min } = await req.json();
  if ([route_id, distance_km, traffic_level, base_time_min].some(v => v == null))
    return Response.json({ error: 'Invalid payload' }, { status: 400 });

  const route = await prisma.route.create({
    data: {
      routeId: Number(route_id),
      distanceKm: Number(distance_km),
      trafficLevel: traffic_level, // "High" | "Medium" | "Low"
      baseTimeMin: Number(base_time_min)
    }
  });
  return Response.json(route, { status: 201 });
}
