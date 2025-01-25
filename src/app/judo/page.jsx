'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function JudoClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('/api/judo-classes');
        if (!response.ok) throw new Error('Failed to fetch classes');
        const data = await response.json();
        setClasses(data);
      } catch (err) {
        setError('Failed to load judo classes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with Stats */}
        <div className="flex flex-col sm:stats shadow bg-base-100 w-full">
          <div className="flex justify-between items-center p-3 sm:stat">
            <div>
              <div className="stat-title text-sm sm:text-base">Total Classes</div>
              <div className="stat-desc text-xs sm:text-sm">Since you started</div>
            </div>
            <div className="stat-value text-xl sm:text-4xl">{classes.length}</div>
          </div>
          
          <div className="flex justify-between items-center p-3 sm:stat">
            <div>
              <div className="stat-title text-sm sm:text-base">This Month</div>
              <div className="stat-desc text-xs sm:text-sm">Classes attended</div>
            </div>
            <div className="stat-value text-xl sm:text-4xl text-primary">
              {classes.filter(c => new Date(c.date).getMonth() === new Date().getMonth()).length}
            </div>
          </div>
          
          <div className="flex justify-between items-center p-3 sm:stat">
            <div>
              <div className="stat-title text-sm sm:text-base">Average Duration</div>
              <div className="stat-desc text-xs sm:text-sm">Per class</div>
            </div>
            <div className="stat-value text-xl sm:text-4xl text-secondary">
              {Math.round(classes.reduce((acc, c) => acc + c.duration, 0) / classes.length || 0)}m
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="navbar bg-base-100 rounded-box shadow">
          <div className="flex-1">
            <div className="form-control">
              <input
                type="text"
                placeholder="Search classes..."
                className="input input-bordered w-full max-w-xs"
              />
            </div>
          </div>
          <div className="flex-none">
            <Link href="/judo/log" className="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Log New Class
            </Link>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Classes Grid */}
        {classes.length === 0 ? (
          <div className="hero bg-base-100 rounded-box shadow-xl py-12">
            <div className="hero-content text-center">
              <div className="max-w-md">
                <h2 className="text-2xl font-bold mb-4">No Classes Logged Yet</h2>
                <p className="mb-6">Start tracking your Judo progress by logging your first class!</p>
                <Link href="/judo/log" className="btn btn-primary">
                  Log Your First Class
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {classes.map((judoClass) => (
              <div key={judoClass._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                <div className="card-body">
                  <h2 className="card-title">
                    {new Date(judoClass.date).toLocaleDateString()}
                    <div className="badge badge-secondary">{judoClass.duration}min</div>
                  </h2>
                  
                  <div className="flex gap-2 my-2">
                    <div className="badge badge-outline">{judoClass.techniques.length} techniques</div>
                    <div className="badge badge-outline">{judoClass.partnerWork.length} drills</div>
                    <div className="badge badge-outline">{judoClass.sparringSessions.length} rounds</div>
                  </div>

                  <div className="card-actions justify-end mt-4">
                    <Link href={`/judo/${judoClass._id}`} className="btn btn-primary">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 