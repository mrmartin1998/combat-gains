'use client';
import { AuthProvider } from './AuthProvider';
// Import any other existing providers you have

export default function Providers({ children }) {
  return (
    <AuthProvider>
      {/* Wrap your existing providers here */}
      {children}
    </AuthProvider>
  );
} 