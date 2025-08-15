// api/auth/login/route.js
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '../../_utils/auth';

export async function POST(req) {
  const { username, password } = await req.json();
  if (!username || !password) return Response.json({ error: 'Missing parameters' }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return Response.json({ error: 'Invalid credentials' }, { status: 401 });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return Response.json({ error: 'Invalid credentials' }, { status: 401 });

  const token = signToken({ userId: user.id });
  const res = Response.json({ message: 'Logged in' });
  res.headers.set('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict; Secure`);
  return res;
}
