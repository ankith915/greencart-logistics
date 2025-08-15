// api/drivers/route.js
import prisma from '@/lib/prisma';
import { verifyRequest } from '../_utils/auth';

export async function GET(req) {
  try { verifyRequest(req); } catch { return Response.json({ error: 'Unauthorized' }, { status: 401 }); }
  const drivers = await prisma.driver.findMany({ orderBy: { id: 'asc' } });
  return Response.json(drivers);
}

export async function POST(req) {
  try { verifyRequest(req); } catch { return Response.json({ error: 'Unauthorized' }, { status: 401 }); }
  const { name, shift_hours, past_week_hours } = await req.json();
  if (!name || shift_hours == null || !Array.isArray(past_week_hours))
    return Response.json({ error: 'Invalid payload' }, { status: 400 });

  const driver = await prisma.driver.create({
    data: { name, shiftHours: Number(shift_hours), pastWeekHours: past_week_hours.map(Number) }
  });
  return Response.json(driver, { status: 201 });
}
