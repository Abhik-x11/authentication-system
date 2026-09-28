/**
 * JWT Token Simulation Utility
 * Fulfills Assignment 7 requirement: "JWT Token Simulation"
 * 
 * Creates a standard 3-part JSON Web Token:
 *   [Base64Url(Header)].[Base64Url(Payload)].[Base64Url(Signature)]
 */

// Helper to base64url-encode a UTF-8 string or JSON object
export function base64UrlEncode(obj) {
  try {
    const jsonString = typeof obj === 'string' ? obj : JSON.stringify(obj);
    // Browser btoa with UTF-8 support
    const base64 = btoa(encodeURIComponent(jsonString).replace(/%([0-9A-F]{2})/g, (_, p1) => {
      return String.fromCharCode('0x' + p1);
    }));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (err) {
    console.error('Base64 encode error:', err);
    return '';
  }
}

// Helper to base64url-decode back to JSON object
export function base64UrlDecode(str) {
  try {
    // Add back padding
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const jsonString = decodeURIComponent(
      Array.prototype.map.call(atob(base64), (c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')
    );
    return JSON.parse(jsonString);
  } catch (err) {
    console.error('Base64 decode error:', err);
    return null;
  }
}

// Generate a simulated cryptographic signature hash
function generateSimulatedSignature(headerEncoded, payloadEncoded, secret = 'taskflow-super-secret-key-2026') {
  let hash = 0;
  const combined = `${headerEncoded}.${payloadEncoded}.${secret}`;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  const hexHash = Math.abs(hash).toString(16).padStart(8, '0');
  return base64UrlEncode(`sig_${hexHash}_verified_token`);
}

/**
 * Creates a simulated JWT token for an authenticated user
 * @param {Object} user 
 * @param {boolean} rememberUser 
 * @returns {string} Simulated JWT token string
 */
export function createSimulatedJWT(user, rememberUser = false) {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const currentTimeSeconds = Math.floor(Date.now() / 1000);
  // If Remember User is checked, token lasts 7 days; otherwise 2 hours
  const expirySeconds = rememberUser ? 7 * 24 * 3600 : 2 * 3600;

  const payload = {
    sub: user.username || user.email,
    id: user.id || `usr_${Date.now()}`,
    name: user.name || user.username,
    username: user.username,
    email: user.email || `${user.username}@taskflow.dev`,
    role: user.role || 'Project Lead',
    rememberUser: !!rememberUser,
    iat: currentTimeSeconds,
    exp: currentTimeSeconds + expirySeconds,
    iss: 'taskflow-auth-system-assignment-7'
  };

  const headerEncoded = base64UrlEncode(header);
  const payloadEncoded = base64UrlEncode(payload);
  const signatureEncoded = generateSimulatedSignature(headerEncoded, payloadEncoded);

  return `${headerEncoded}.${payloadEncoded}.${signatureEncoded}`;
}

/**
 * Decodes and inspects a simulated JWT
 * @param {string} token 
 * @returns {Object|null}
 */
export function decodeSimulatedJWT(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const header = base64UrlDecode(parts[0]);
  const payload = base64UrlDecode(parts[1]);

  return {
    raw: token,
    header,
    payload,
    signature: parts[2],
    rawParts: {
      header: parts[0],
      payload: parts[1],
      signature: parts[2]
    }
  };
}

/**
 * Checks if a JWT token is expired
 * @param {string} token 
 * @returns {boolean}
 */
export function isTokenExpired(token) {
  const decoded = decodeSimulatedJWT(token);
  if (!decoded || !decoded.payload || !decoded.payload.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return decoded.payload.exp < now;
}
