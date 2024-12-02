import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAuth } from '@/app/lib/utils/auth';
import { AUTH_COOKIE_NAME } from '@/app/config';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const user = await verifyAuth(req);
    
    if (!user) {
      return NextResponse.json(null);
    }

    return NextResponse.json({
      user: {
        id: user.userId,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(null);
  }
} 