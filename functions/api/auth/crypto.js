// Utility for password hashing and secure token generation on Cloudflare Edge

const ITERATIONS = 100000;
const HASH_BYTES = 64;
const ALGORITHM = 'SHA-256';

export async function hashPassword(password, saltString) {
  // Convert strings to Uint8Array
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  
  const saltBuffer = saltString ? 
    Uint8Array.from(atob(saltString), c => c.charCodeAt(0)) : 
    crypto.getRandomValues(new Uint8Array(16));
  
  // Import password as key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  
  // Derive hash
  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: ITERATIONS,
      hash: ALGORITHM
    },
    keyMaterial,
    HASH_BYTES * 8
  );
  
  // Convert salt and hash back to base64 strings
  const saltBase64 = btoa(String.fromCharCode.apply(null, saltBuffer));
  const hashBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(hashBuffer)));
  
  return {
    hash: hashBase64,
    salt: saltBase64
  };
}

export async function verifyPassword(password, storedHash, storedSalt) {
  const { hash } = await hashPassword(password, storedSalt);
  return hash === storedHash;
}

export function generateSecureToken(bytes = 32) {
  const buffer = new Uint8Array(bytes);
  crypto.getRandomValues(buffer);
  return btoa(String.fromCharCode.apply(null, buffer)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
