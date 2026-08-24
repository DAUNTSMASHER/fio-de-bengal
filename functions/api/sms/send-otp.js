export async function onRequestPost(context) {
  const { request, env, data } = context;

  // The middleware already populated data.auth and data.user
  if (!data.auth || !data.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { phone } = await request.json();
    
    if (!phone) {
      return new Response(JSON.stringify({ error: 'Phone number is required' }), { status: 400 });
    }

    // 1. Generate a secure 6-digit OTP
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const code = (array[0] % 900000 + 100000).toString(); // Ensures 6 digits

    // 2. Set expiration to 5 minutes from now
    const expiresAt = Math.floor(Date.now() / 1000) + 5 * 60;

    // 3. Upsert into D1 database
    // We use REPLACE to overwrite any existing OTP for this user
    await env.DB.prepare(`
      INSERT OR REPLACE INTO otps (user_id, code, expires_at) 
      VALUES (?, ?, ?)
    `).bind(data.auth.userId, code, expiresAt).run();

    // 4. Send SMS via Twilio (Generic API fetch)
    const twilioAccountSid = env.TWILIO_ACCOUNT_SID || 'YOUR_TWILIO_SID';
    const twilioAuthToken = env.TWILIO_AUTH_TOKEN || 'YOUR_TWILIO_TOKEN';
    const twilioPhone = env.TWILIO_PHONE_NUMBER || '+1234567890';

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
    const authHeader = 'Basic ' + btoa(`${twilioAccountSid}:${twilioAuthToken}`);

    const body = new URLSearchParams({
      To: phone,
      From: twilioPhone,
      Body: `Your FIO DE BENGAL verification code is: ${code}`
    });

    const twilioResponse = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString()
    });

    if (!twilioResponse.ok) {
      const errorText = await twilioResponse.text();
      console.error('Twilio Error:', errorText);
      return new Response(JSON.stringify({ error: 'Failed to send SMS' }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, message: 'OTP sent successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Send OTP Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
