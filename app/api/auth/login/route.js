// app/api/auth/login/route.js
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '../../_utils/auth';

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    if (!username || !password)
      return new Response(JSON.stringify({ error: 'Missing parameters' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401, headers: { 'Content-Type': 'application/json' } });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401, headers: { 'Content-Type': 'application/json' } });

    const token = signToken({ userId: user.id });
    const secureFlag = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    const cookie = `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict${secureFlag}`;

    return new Response(JSON.stringify({ message: 'Logged in' }), {
      status: 200,
      headers: { 'Set-Cookie': cookie, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
