import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { AUTH_COOKIE_NAME } from '@/app/config';

export async function verifyAuth(req) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
} 