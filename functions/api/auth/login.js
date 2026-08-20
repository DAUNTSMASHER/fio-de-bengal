export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const { email, password } = await request.json();

    // In a real application, you would query Cloudflare D1 here:
    // const { results } = await env.DB.prepare("SELECT * FROM Users WHERE email = ?").bind(email).all();
    
    // MOCK RESPONSE for now
    if (email === 'admin@fiodebengal.com') {
      return new Response(JSON.stringify({
        token: 'mock-jwt-admin-token-xyz',
        user: { id: 1, name: 'Admin User', email, role: 'admin' }
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (email === 'buyer@example.com') {
      return new Response(JSON.stringify({
        token: 'mock-jwt-buyer-token-abc',
        user: { id: 2, name: 'Valued Customer', email, role: 'buyer' }
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
