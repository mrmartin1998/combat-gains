'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Plus, Calendar, Dumbbell, Trophy, History } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({
    stats: {
      totalWorkouts: 0,
      totalJudoClasses: 0,
      thisMonth: {
        workouts: 0,
        judoClasses: 0
      }
    },
    recentActivity: {
      workouts: [],
      judoClasses: []
    }
  });

  useEffect(() => {
    if (status === 'authenticated') {
      fetchDashboardData();
    }
  }, [status]);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/dashboard', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch dashboard data');
      }
      const dashboardData = await res.json();
      setData(dashboardData);
    } catch (err) {
      console.error('Dashboard error:', err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-base-200 p-4 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-base-200 p-4 flex items-center justify-center">
        <div className="alert alert-error">
          <span>Please log in to access the dashboard</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 p-4 flex items-center justify-center">
        <div className="alert alert-error">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/workouts/new" className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body flex flex-row items-center">
              <Dumbbell className="w-6 h-6" />
              <h2 className="card-title">New Workout</h2>
            </div>
          </Link>
          <Link href="/judo-classes/new" className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body flex flex-row items-center">
              <Calendar className="w-6 h-6" />
              <h2 className="card-title">Log Judo Class</h2>
            </div>
          </Link>
          <Link href="/workouts/templates" className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body flex flex-row items-center">
              <Plus className="w-6 h-6" />
              <h2 className="card-title">Workout Templates</h2>
            </div>
          </Link>
          <Link href="/progress" className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body flex flex-row items-center">
              <Trophy className="w-6 h-6" />
              <h2 className="card-title">View Progress</h2>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Workouts */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title flex items-center gap-2">
                <Dumbbell className="w-5 h-5" />
                Recent Workouts
              </h2>
              {data.recentActivity.workouts.length > 0 ? (
                <div className="space-y-4">
                  {data.recentActivity.workouts.map((workout) => (
                    <Link 
                      key={workout._id} 
                      href={`/workouts/${workout._id}`}
                      className="block p-4 rounded-lg bg-base-200 hover:bg-base-300 transition-colors"
                    >
                      <div className="font-semibold">{workout.name || 'Unnamed Workout'}</div>
                      <div className="text-sm opacity-70">
                        {new Date(workout.date).toLocaleDateString()}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-base-content/70">
                  No recent workouts
                </div>
              )}
              <div className="card-actions justify-end">
                <Link href="/workouts" className="btn btn-primary btn-sm">
                  View All
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Judo Classes */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title flex items-center gap-2">
                <History className="w-5 h-5" />
                Recent Judo Classes
              </h2>
              {data.recentActivity.judoClasses.length > 0 ? (
                <div className="space-y-4">
                  {data.recentActivity.judoClasses.map((judoClass) => (
                    <Link 
                      key={judoClass._id} 
                      href={`/judo-classes/${judoClass._id}`}
                      className="block p-4 rounded-lg bg-base-200 hover:bg-base-300 transition-colors"
                    >
                      <div className="font-semibold">{judoClass.type || 'Regular Class'}</div>
                      <div className="text-sm opacity-70">
                        {new Date(judoClass.date).toLocaleDateString()}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-base-content/70">
                  No recent judo classes
                </div>
              )}
              <div className="card-actions justify-end">
                <Link href="/judo-classes" className="btn btn-primary btn-sm">
                  View All
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 