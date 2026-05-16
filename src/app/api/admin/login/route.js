import { NextResponse } from 'next/server';
import {
  getAdminAuthConfigError,
  getAdminSessionCookie,
  validateAdminCredentials,
} from '../../../../lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const credentials = await request.json();
  const configError = getAdminAuthConfigError();

  if (configError) {
    return NextResponse.json(
      { error: configError },
      {
        status: 503,
        headers: { 'Cache-Control': 'no-store' },
      }
    );
  }

  if (!validateAdminCredentials(credentials)) {
    return NextResponse.json(
      { error: 'Invalid admin credentials.' },
      {
        status: 401,
        headers: { 'Cache-Control': 'no-store' },
      }
    );
  }

  const response = NextResponse.json(
    { ok: true },
    {
      headers: { 'Cache-Control': 'no-store' },
    }
  );
  response.cookies.set(getAdminSessionCookie());
  return response;
}
