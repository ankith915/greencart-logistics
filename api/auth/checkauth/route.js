import jwt from 'jsonwebtoken';

export async function GET(req) {
  const token = req.headers.get('authorization')?.split(' ')[1] || req.cookies.get('token')?.value;
  if (!token) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return new Response(JSON.stringify({ message: 'Authorized' }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
}