// api/orders/route.js
import prisma from '@/lib/prisma';
import { verifyRequest } from '../../_utils/auth';

export async function GET(req) {
  try { verifyRequest(req); } catch { return Response.json({ error: 'Unauthorized' }, { status: 401 }); }
  const orders = await prisma.order.findMany({ orderBy: { orderId: 'asc' } });
  return Response.json(orders);
}

export async function POST(req) {
  try { verifyRequest(req); } catch { return Response.json({ error: 'Unauthorized' }, { status: 401 }); }
  const { order_id, value_rs, route_id, delivery_time } = await req.json();
  if ([order_id, value_rs, route_id, delivery_time].some(v => v == null))
    return Response.json({ error: 'Invalid payload' }, { status: 400 });

  // Ensure route exists by routeId
  const route = await prisma.route.findUnique({ where: { routeId: Number(route_id) } });
  if (!route) return Response.json({ error: 'Route not found' }, { status: 404 });

  const order = await prisma.order.create({
    data: {
      orderId: Number(order_id),
      valueRs: Number(value_rs),
      routeId: route.routeId,
      deliveryTime: String(delivery_time),
    }
  });
  return Response.json(order, { status: 201 });
}
