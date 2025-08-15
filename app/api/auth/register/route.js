// api/auth/register/route.js
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  const { username, password } = await req.json();
  if (!username || !password) {
    return Response.json({ error: 'Missing username or password' }, { status: 400 });
  }

  const exists = await prisma.user.findUnique({ where: { username } });
  if (exists) return Response.json({ error: 'User already exists' }, { status: 409 });

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { username, password: hashed } });
  return Response.json({ id: user.id, username: user.username }, { status: 201 });
}
