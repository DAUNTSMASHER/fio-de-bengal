export async function onRequest(context) {
  const { request, env, next } = context;

  // Allow preflight OPTIONS requests
  if (request.method === 'OPTIONS') {
    return next();
  }

  const url = new URL(request.url);

  // Allow authentication endpoints, public products GET, and public inventory GET
  if (url.pathname.startsWith('/api/auth/') || 
     (url.pathname === '/api/products' && request.method === 'GET') ||
     (url.pathname === '/api/inventory' && request.method === 'GET')) {
    return context.next();
  }

  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('No valid Authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Check token against D1 sessions table
    const { results } = await env.DB.prepare(
      `SELECT users.id, users.email, users.role, sessions.expires_at 
       FROM sessions 
       JOIN users ON sessions.user_id = users.id 
       WHERE sessions.id = ?`
    ).bind(token).all();

    const session = results[0];

    if (!session || session.expires_at < Date.now()) {
      // Clean up expired session if we found one
      if (session) {
        await env.DB.prepare(`DELETE FROM sessions WHERE id = ?`).bind(token).run();
      }
      throw new Error('Session expired or invalid');
    }

    // Pass user data to the request for downstream handlers
    context.data = context.data || {};
    context.data.user = {
      id: session.id,
      email: session.email,
      role: session.role
    };

    return next();
  } catch (error) {
    console.error('Session authentication failed:', error);
    return new Response(JSON.stringify({ error: 'Unauthorized', details: error.message }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
