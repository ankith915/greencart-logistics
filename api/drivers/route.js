import connectDB from '../../../lib/db';
import Driver from '../../../models/Driver';
import jwt from 'jsonwebtoken';

function verifyToken(req) { /* same as above */ }

export async function GET() {
  try {
    verifyToken(req);
  } catch {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  await connectDB();
  const drivers = await Driver.find();
  return Response.json(drivers);
}

export async function POST(req) {
  try {
    verifyToken(req);
  } catch {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  await connectDB();
  const data = await req.json();
  const driver = new Driver(data);
  await driver.save();
  return Response.json(driver);
}