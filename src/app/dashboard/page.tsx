'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface DashboardData {
  stats: {
    totalWorkouts: number;
    totalJudoClasses: number;
    thisMonth: {
      workouts: number;
      judoClasses: number;
    };
  };
  recentActivity: {
    workouts: Array<{
      _id: string;
      type: string;
      date: string;
      duration: number;
    }>;
    judoClasses: Array<{
      _id: string;
      date: string;
      duration: number;
      techniques: Array<any>;
    }>;
  };
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const dashboardData = await response.json();
        setData(dashboardData);
      } catch (err) {
        setError('Error loading dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 p-4 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 p-4">
        <div className="alert alert-error max-w-md mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Stats Overview */}
        <div className="stats shadow bg-base-100 w-full">
          <div className="stat">
            <div className="stat-title">Total Workouts</div>
            <div className="stat-value">{data?.stats.totalWorkouts || 0}</div>
            <div className="stat-desc">Since you started</div>
          </div>
          <div className="stat">
            <div className="stat-title">Judo Classes</div>
            <div className="stat-value">{data?.stats.totalJudoClasses || 0}</div>
            <div className="stat-desc">Total attended</div>
          </div>
          <div className="stat">
            <div className="stat-title">This Month</div>
            <div className="stat-value text-primary">
              {(data?.stats.thisMonth.workouts || 0) + (data?.stats.thisMonth.judoClasses || 0)}
            </div>
            <div className="stat-desc">Training sessions</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Workout Section */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Strength Training</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="opacity-70">Recent Workouts</span>
                  <Link href="/workouts" className="link link-primary">View all</Link>
                </div>
                {data?.recentActivity.workouts.length ? (
                  <div className="space-y-2">
                    {data.recentActivity.workouts.slice(0, 3).map((workout) => (
                      <Link 
                        key={workout._id} 
                        href={`/workouts/${workout._id}`}
                        className="block p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{workout.type}</span>
                          <span className="text-sm opacity-70">
                            {formatDistanceToNow(new Date(workout.date), { addSuffix: true })}
                          </span>
                        </div>
                        <div className="text-sm opacity-70">{workout.duration} minutes</div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 opacity-70">No recent workouts</div>
                )}
                <div className="space-y-2">
                  <Link href="/workouts/create" className="btn btn-primary w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    New Workout
                  </Link>
                  <Link href="/workouts/templates" className="btn btn-ghost w-full">
                    View Templates
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Judo Section */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Judo Training</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="opacity-70">Recent Classes</span>
                  <Link href="/judo" className="link link-primary">View all</Link>
                </div>
                {data?.recentActivity.judoClasses.length ? (
                  <div className="space-y-2">
                    {data.recentActivity.judoClasses.slice(0, 3).map((judoClass) => (
                      <Link 
                        key={judoClass._id} 
                        href={`/judo/${judoClass._id}`}
                        className="block p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Judo Class</span>
                          <span className="text-sm opacity-70">
                            {formatDistanceToNow(new Date(judoClass.date), { addSuffix: true })}
                          </span>
                        </div>
                        <div className="text-sm opacity-70">
                          {judoClass.techniques.length} techniques • {judoClass.duration} minutes
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 opacity-70">No recent classes</div>
                )}
                <div className="space-y-2">
                  <Link href="/judo/log" className="btn btn-primary w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Log New Class
                  </Link>
                  <Link href="/judo/techniques" className="btn btn-ghost w-full">
                    Technique Library
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Training Insights */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Training Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="alert">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-bold">This Month</h3>
                  <div className="text-sm">
                    {data?.stats.thisMonth.workouts || 0} workouts • {data?.stats.thisMonth.judoClasses || 0} classes
                  </div>
                </div>
              </div>
              <div className="alert">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-success shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-bold">Total Training Time</h3>
                  <div className="text-sm">
                    View your progress summary
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 