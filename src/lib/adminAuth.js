import crypto from 'crypto';

export const adminCookieName = 'udt_admin_session';

const getAdminSecret = () => process.env.ADMIN_SESSION_SECRET || process.env.NEXTAUTH_SECRET;

const getAdminUsername = () => process.env.ADMIN_USERNAME;

const getAdminPassword = () => process.env.ADMIN_PASSWORD;

export const getAdminAuthConfigError = () => {
  if (!getAdminUsername() || !getAdminPassword() || !getAdminSecret()) {
    return 'Admin authentication is not configured. Set ADMIN_USERNAME, ADMIN_PASSWORD, and ADMIN_SESSION_SECRET.';
  }
  return null;
};

const secureEquals = (left = '', right = '') => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return (
    leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer)
  );
};

const createSessionToken = () =>
  crypto.createHmac('sha256', getAdminSecret()).update('udt-admin').digest('hex');

export const validateAdminCredentials = ({ username, password }) =>
  !getAdminAuthConfigError() &&
  secureEquals(username, getAdminUsername()) &&
  secureEquals(password, getAdminPassword());

export const getAdminSessionCookie = () => ({
  name: adminCookieName,
  value: createSessionToken(),
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 60 * 60 * 8,
});

export const isValidAdminToken = (token) =>
  !getAdminAuthConfigError() && secureEquals(token, createSessionToken());

export const isAdminRequest = (request) =>
  isValidAdminToken(request.cookies.get(adminCookieName)?.value);

export const isAdminCookieStore = (cookieStore) =>
  isValidAdminToken(cookieStore.get(adminCookieName)?.value);

export const unauthorizedResponse = () =>
  Response.json(
    { error: 'Admin authentication required.' },
    {
      status: 401,
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  );
