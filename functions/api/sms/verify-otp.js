import { createClerkClient } from '@clerk/backend';

export async function onRequestPost(context) {
  const { request, env, data } = context;

  // The middleware already populated data.auth and data.user
  if (!data.auth || !data.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { code } = await request.json();
    
    if (!code) {
      return new Response(JSON.stringify({ error: 'Code is required' }), { status: 400 });
    }

    const userId = data.auth.userId;

    // 1. Look up the active code in the D1 database
    const record = await env.DB.prepare(`
      SELECT code, expires_at FROM otps WHERE user_id = ?
    `).bind(userId).first();

    if (!record) {
      return new Response(JSON.stringify({ error: 'No OTP requested or OTP expired' }), { status: 400 });
    }

    // 2. Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (now > record.expires_at) {
      return new Response(JSON.stringify({ error: 'OTP has expired' }), { status: 400 });
    }

    // 3. Verify match
    if (record.code !== code) {
      return new Response(JSON.stringify({ error: 'Invalid OTP code' }), { status: 400 });
    }

    // 4. If valid, update user metadata in Clerk
    const clerk = createClerkClient({ secretKey: env.CLERK_SECRET_KEY, publishableKey: env.VITE_CLERK_PUBLISHABLE_KEY });
    
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        phoneVerified: true
      }
    });

    // 5. Clean up the OTP from DB
    await env.DB.prepare(`
      DELETE FROM otps WHERE user_id = ?
    `).bind(userId).run();

    return new Response(JSON.stringify({ success: true, message: 'Phone verified successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
