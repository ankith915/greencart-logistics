// app/api/auth/logout/route.js
export async function POST() {
  // Clear cookie (use Secure only in production)
  const secureFlag = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  const cookie = `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict${secureFlag}`;
  return new Response(JSON.stringify({ message: 'Logged out' }), {
    status: 200,
    headers: { 'Set-Cookie': cookie, 'Content-Type': 'application/json' }
  });
}
