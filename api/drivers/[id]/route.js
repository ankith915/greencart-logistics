import connectDB from '../../../../lib/db';
import Driver from '../../../../models/Driver';
import jwt from 'jsonwebtoken';

function verifyToken(req) { /* same */ }

export async function PUT(req, { params }) {
  try {
    verifyToken(req);
  } catch {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  await connectDB();
  const data = await req.json();
  const driver = await Driver.findByIdAndUpdate(params.id, data, { new: true });
  if (!driver) return new Response(JSON.stringify({ error: 'Driver not found' }), { status: 404 });
  return Response.json(driver);
}

export async function DELETE(req, { params }) {
  try {
    verifyToken(req);
  } catch {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  await connectDB();
  const driver = await Driver.findByIdAndDelete(params.id);
  if (!driver) return new Response(JSON.stringify({ error: 'Driver not found' }), { status: 404 });
  return Response.json({ message: 'Deleted' });
}