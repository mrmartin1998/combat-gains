'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const res = await fetch('/api/workouts');
      if (!res.ok) throw new Error('Failed to fetch workouts');
      const data = await res.json();
      setWorkouts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 p-4 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="navbar bg-base-100 rounded-box shadow">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Workouts</h1>
          </div>
          <div className="flex-none gap-2">
            <Link href="/workouts/templates" className="btn btn-ghost">
              Templates
            </Link>
            <Link href="/workouts/create" className="btn btn-primary">
              <Plus className="h-4 w-4" />
              New Workout
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workouts.map((workout) => (
            <Link
              key={workout._id}
              href={`/workouts/${workout._id}`}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="card-title capitalize">{workout.type} Workout</h2>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <div className="badge badge-outline">
                        {new Date(workout.date).toLocaleDateString()}
                      </div>
                      <div className="badge badge-outline">{workout.duration} min</div>
                    </div>
                  </div>
                </div>
                <div className="text-sm opacity-70 mt-4">
                  {workout.exercises.length} exercises
                </div>
              </div>
            </Link>
          ))}
        </div>

        {workouts.length === 0 && !error && (
          <div className="alert">
            <span>No workouts found. Create your first workout!</span>
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
} 