'use client';

import { AUTH_COOKIE_NAME } from '@/app/config';

export async function signOut() {
  try {
    // Call the logout endpoint
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    
    // Remove the auth cookie
    document.cookie = `${AUTH_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    
    // Redirect to login page
    window.location.href = '/login';
  } catch (error) {
    console.error('Sign out error:', error);
  }
} 