import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Hero Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <h1 className="text-4xl font-bold mb-2">Combat Gains</h1>
            <p className="text-xl opacity-70">Track your martial arts journey and strength training progress</p>
            <div className="flex justify-center gap-4 mt-6">
              <Link href="/register" className="btn btn-primary">
                Get Started
              </Link>
              <Link href="/login" className="btn btn-ghost">
                Login
              </Link>
            </div>
          </div>
        </div>

        {/* Features Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title justify-center mb-6">Everything you need to track your progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="flex justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg">Workout Tracking</h3>
                <p className="text-sm opacity-70">Log and monitor your strength training progress with detailed exercise tracking</p>
              </div>

              <div className="text-center space-y-2">
                <div className="flex justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg">Judo Classes</h3>
                <p className="text-sm opacity-70">Record techniques, partner work, and sparring sessions from your judo training</p>
              </div>

              <div className="text-center space-y-2">
                <div className="flex justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg">Progress Analytics</h3>
                <p className="text-sm opacity-70">Visualize your improvement with detailed statistics and progress tracking</p>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title justify-center mb-4">Start Your Journey Today</h2>
            <div className="text-center space-y-4">
              <p className="opacity-70">
                Join Combat Gains to start tracking your martial arts and strength training progress. 
                Create custom workout templates, log your judo classes, and monitor your improvement over time.
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/register" className="btn btn-primary">
                  Create Account
                </Link>
                <Link href="/about" className="btn btn-ghost">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
