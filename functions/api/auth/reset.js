import { hashPassword, generateSecureToken } from './crypto';

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { action, email, token, newPassword } = await request.json();

    if (action === 'request') {
      if (!email) return new Response(JSON.stringify({ error: 'Email required' }), { status: 400 });

      // Check if user exists
      const { results } = await env.DB.prepare(`SELECT id FROM users WHERE email = ?`).bind(email.toLowerCase()).all();
      
      if (results.length > 0) {
        const resetToken = generateSecureToken(32);
        const expiry = Date.now() + 60 * 60 * 1000; // 1 hour

        await env.DB.prepare(
          `UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?`
        ).bind(resetToken, expiry, email.toLowerCase()).run();

        // MOCK EMAIL SENDING
        // In a real app, you would use fetch() to call Resend, SendGrid, etc. here.
        console.log(`\n\n--- MOCK EMAIL ---`);
        console.log(`To: ${email}`);
        console.log(`Subject: Password Reset Request`);
        console.log(`Link: https://www.fiodebengal.com/reset-password?token=${resetToken}`);
        console.log(`------------------\n\n`);
      }

      // Always return success to prevent email enumeration
      return new Response(JSON.stringify({ success: true, message: "If that email is in our system, we have sent a reset link." }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    } else if (action === 'reset') {
      if (!token || !newPassword) return new Response(JSON.stringify({ error: 'Token and new password required' }), { status: 400 });

      // Verify token
      const { results } = await env.DB.prepare(
        `SELECT id, reset_token_expiry FROM users WHERE reset_token = ?`
      ).bind(token).all();

      const user = results[0];

      if (!user || user.reset_token_expiry < Date.now()) {
        return new Response(JSON.stringify({ error: 'Invalid or expired reset token' }), { status: 400 });
      }

      // Hash new password
      const { hash, salt } = await hashPassword(newPassword);

      // Update password and clear token
      await env.DB.prepare(
        `UPDATE users SET password_hash = ?, salt = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?`
      ).bind(hash, salt, user.id).run();

      // Clear all existing sessions for this user for security
      await env.DB.prepare(
        `DELETE FROM sessions WHERE user_id = ?`
      ).bind(user.id).run();

      return new Response(JSON.stringify({ success: true, message: 'Password reset successfully. You can now log in.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });

  } catch (error) {
    console.error('Reset error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
