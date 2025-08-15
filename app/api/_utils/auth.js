// api/_utils/auth.js
import jwt from 'jsonwebtoken';

export function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

export function verifyRequest(req) {
  // Works in Next 15 route handlers (Request)
  const header = req.headers.get('authorization');
  const cookieHeader = req.headers.get('cookie') || '';
  const tokenFromHeader = header?.startsWith('Bearer ') ? header.split(' ')[1] : null;
  const tokenFromCookie = cookieHeader.split('; ').find(c => c.startsWith('token='))?.split('=')[1];
  const token = tokenFromHeader || tokenFromCookie;
  if (!token) throw new Error('Unauthorized');
  return jwt.verify(token, process.env.JWT_SECRET);
}
