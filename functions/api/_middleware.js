import { createClerkClient } from '@clerk/backend';

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

  const clerk = createClerkClient({ secretKey: env.CLERK_SECRET_KEY, publishableKey: env.VITE_CLERK_PUBLISHABLE_KEY });

  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No Authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const requestState = await clerk.authenticateRequest(request, {
      jwtKey: env.CLERK_JWT_KEY,
      authorizedParties: [url.origin],
    });

    if (!requestState.isSignedIn) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    // Fetch the user to check metadata
    const user = await clerk.users.getUser(requestState.toAuth().userId);

    // Verify phone verification requirement unless hitting the SMS endpoints
    const isSmsRoute = url.pathname.startsWith('/api/sms/');
    if (!isSmsRoute) {
      const isPhoneVerified = user.publicMetadata?.phoneVerified === true;
      if (!isPhoneVerified) {
        return new Response(JSON.stringify({ error: 'Phone verification required' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Pass user data to the request for downstream handlers
    context.data = context.data || {};
    context.data.auth = requestState.toAuth();
    context.data.user = user;

    return next();
  } catch (error) {
    console.error('Clerk authentication failed:', error);
    return new Response(JSON.stringify({ error: 'Invalid or expired token', details: error.message }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
