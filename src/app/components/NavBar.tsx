'use client';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname.startsWith(path) ? 'active' : '';
  };

  return (
    <div className="navbar bg-base-200">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52">
            <li><Link href="/workouts" className={isActive('/workouts')}>Workouts</Link></li>
            <li><Link href="/workouts/templates" className={isActive('/workouts/templates')}>Templates</Link></li>
            <li><Link href="/judo" className={isActive('/judo')}>Judo Classes</Link></li>
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost normal-case text-xl">Combat Gains</Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link href="/workouts" className={isActive('/workouts')}>Workouts</Link></li>
          <li><Link href="/workouts/templates" className={isActive('/workouts/templates')}>Templates</Link></li>
          <li><Link href="/judo" className={isActive('/judo')}>Judo Classes</Link></li>
        </ul>
      </div>
      
      <div className="navbar-end">
        {status === 'loading' ? (
          <span className="loading loading-spinner"></span>
        ) : session ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost">
              <span className="hidden md:inline mr-2">{session.user?.name}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52">
              <li><Link href="/profile">Profile</Link></li>
              <li><button onClick={() => signOut()}>Sign Out</button></li>
            </ul>
          </div>
        ) : (
          <Link href="/login" className="btn btn-primary">Login</Link>
        )}
      </div>
    </div>
  );
} 