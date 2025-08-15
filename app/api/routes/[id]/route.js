// api/routes/[id]/route.js
import prisma from '@/lib/prisma';
import { verifyRequest } from '../../_utils/auth';

export async function PUT(req, { params }) {
  try { verifyRequest(req); } catch { return Response.json({ error: 'Unauthorized' }, { status: 401 }); }
  const body = await req.json();
  const route = await prisma.route.update({
    where: { id: Number(params.id) },
    data: {
      ...(body.route_id != null && { routeId: Number(body.route_id) }),
      ...(body.distance_km != null && { distanceKm: Number(body.distance_km) }),
      ...(body.traffic_level && { trafficLevel: body.traffic_level }),
      ...(body.base_time_min != null && { baseTimeMin: Number(body.base_time_min) }),
    }
  });
  return Response.json(route);
}

export async function DELETE(req, { params }) {
  try { verifyRequest(req); } catch { return Response.json({ error: 'Unauthorized' }, { status: 401 }); }
  await prisma.route.delete({ where: { id: Number(params.id) } });
  return Response.json({ message: 'Deleted' });
}
