import { verifyPassword, generateSecureToken } from './crypto';

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password required' }), { status: 400 });
    }

    // Fetch user from D1
    const { results } = await env.DB.prepare(
      `SELECT * FROM users WHERE email = ?`
    ).bind(email.toLowerCase()).all();

    const user = results[0];

    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 });
    }

    // Verify Password
    const isValid = await verifyPassword(password, user.password_hash, user.salt);
    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 });
    }

    // Generate Session
    const sessionToken = generateSecureToken(32);
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    
    await env.DB.prepare(
      `INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)`
    ).bind(sessionToken, user.id, expiresAt).run();

    return new Response(JSON.stringify({ 
      success: true, 
      token: sessionToken,
      user: { id: user.id, email: user.email, role: user.role }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
