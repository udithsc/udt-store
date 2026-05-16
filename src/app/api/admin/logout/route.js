import { NextResponse } from 'next/server';
import { adminCookieName } from '../../../../lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json(
    { ok: true },
    {
      headers: { 'Cache-Control': 'no-store' },
    }
  );
  response.cookies.set({
    name: adminCookieName,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
  return response;
}
