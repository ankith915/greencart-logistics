// api/orders/[id]/route.js
import prisma from '@/lib/prisma';
import { verifyRequest } from '../../_utils/auth';

export async function PUT(req, { params }) {
  try { verifyRequest(req); } catch { return Response.json({ error: 'Unauthorized' }, { status: 401 }); }
  const body = await req.json();

  let data = {};
  if (body.order_id != null) data.orderId = Number(body.order_id);
  if (body.value_rs != null) data.valueRs = Number(body.value_rs);
  if (body.delivery_time != null) data.deliveryTime = String(body.delivery_time);
  if (body.route_id != null) {
    const route = await prisma.route.findUnique({ where: { routeId: Number(body.route_id) } });
    if (!route) return Response.json({ error: 'Route not found' }, { status: 404 });
    data.routeId = route.routeId;
  }

  const order = await prisma.order.update({ where: { id: Number(params.id) }, data });
  return Response.json(order);
}

export async function DELETE(req, { params }) {
  try { verifyRequest(req); } catch { return Response.json({ error: 'Unauthorized' }, { status: 401 }); }
  await prisma.order.delete({ where: { id: Number(params.id) } });
  return Response.json({ message: 'Deleted' });
}
