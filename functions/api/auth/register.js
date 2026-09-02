import { hashPassword, generateSecureToken } from './crypto';

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password required' }), { status: 400 });
    }

    const { hash, salt } = await hashPassword(password);
    const userId = generateSecureToken(16);
    
    // Make the first user (or specific emails) an admin automatically
    // You can modify this array to include your actual admin emails
    const ADMIN_EMAILS = ['admin@fiodebengal.com', 'fiodebengal@gmail.com'];
    const role = ADMIN_EMAILS.includes(email.toLowerCase()) ? 'admin' : 'buyer';

    // Insert user into D1
    const stmt = env.DB.prepare(
      `INSERT INTO users (id, email, password_hash, salt, role) VALUES (?, ?, ?, ?, ?)`
    ).bind(userId, email.toLowerCase(), hash, salt, role);
    
    try {
      await stmt.run();
    } catch (dbErr) {
      if (dbErr.message.includes('UNIQUE constraint failed')) {
        return new Response(JSON.stringify({ error: 'Email already exists' }), { status: 409 });
      }
      throw dbErr;
    }

    // Auto-login after registration by creating a session
    const sessionToken = generateSecureToken(32);
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    
    await env.DB.prepare(
      `INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)`
    ).bind(sessionToken, userId, expiresAt).run();

    return new Response(JSON.stringify({ 
      success: true, 
      token: sessionToken,
      user: { id: userId, email: email, role: role, name: name }
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
