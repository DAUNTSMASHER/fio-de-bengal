const ADMIN_EMAILS = [
  'admin@fiodebengal.com',
  'fiodebengal@gmail.com',
];

export async function onRequest(context) {
  const { request, env, next } = context;

  // Allow preflight OPTIONS requests
  if (request.method === 'OPTIONS') {
    return next();
  }

  // We skip authentication for public routes if any (e.g. login hooks, public products list)
  const url = new URL(request.url);
  if (url.pathname === '/api/products' && request.method === 'GET') {
    return next();
  }

  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('No valid Authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Securely verify the Google JWT using Google's tokeninfo endpoint
    // This works perfectly in Cloudflare Workers without needing Node.js crypto libraries
    const googleVerifyResponse = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`);
    
    if (!googleVerifyResponse.ok) {
       throw new Error('Invalid or expired Google Token');
    }
    
    const decodedToken = await googleVerifyResponse.json();
    
    // Determine user role
    const role = ADMIN_EMAILS.includes(decodedToken.email) ? 'admin' : 'buyer';

    // Pass user data to the request for downstream handlers
    context.data = context.data || {};
    context.data.user = {
      id: decodedToken.sub,
      email: decodedToken.email,
      name: decodedToken.name,
      role: role
    };

    return next();
  } catch (error) {
    console.error('Google JWT authentication failed:', error);
    return new Response(JSON.stringify({ error: 'Unauthorized', details: error.message }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
