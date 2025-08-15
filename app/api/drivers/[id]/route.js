// api/drivers/[id]/route.js
import prisma from '@/lib/prisma';
import { verifyRequest } from '../../_utils/auth';

export async function PUT(req, { params }) {
  try { verifyRequest(req); } catch { return Response.json({ error: 'Unauthorized' }, { status: 401 }); }
  const { name, shift_hours, past_week_hours } = await req.json();
  const driver = await prisma.driver.update({
    where: { id: Number(params.id) },
    data: {
      ...(name && { name }),
      ...(shift_hours != null && { shiftHours: Number(shift_hours) }),
      ...(past_week_hours && { pastWeekHours: past_week_hours.map(Number) })
    }
  });
  return Response.json(driver);
}

export async function DELETE(req, { params }) {
  try { verifyRequest(req); } catch { return Response.json({ error: 'Unauthorized' }, { status: 401 }); }
  await prisma.driver.delete({ where: { id: Number(params.id) } });
  return Response.json({ message: 'Deleted' });
}
