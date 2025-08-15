// api/auth/checkauth/route.js
import { verifyRequest } from '../../_utils/auth';

export async function GET(req) {
  try {
    verifyRequest(req);
    return Response.json({ ok: true }, { status: 200 });
  } catch {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
