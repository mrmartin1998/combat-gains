'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Exercise, Workout } from '@/app/types/workout';

export default function WorkoutsList() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    dateFrom: '',
    dateTo: '',
  });

  useEffect(() => {
    fetchWorkouts();
  }, []);

  useEffect(() => {
    filterWorkouts();
  }, [workouts, filters]);

  const fetchWorkouts = async () => {
    try {
      const res = await fetch('/api/workouts');
      if (!res.ok) throw new Error('Failed to fetch workouts');
      const data = await res.json();
      setWorkouts(data);
      setFilteredWorkouts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterWorkouts = () => {
    let filtered = [...workouts];

    // Filter by type
    if (filters.type !== 'all') {
      filtered = filtered.filter(workout => workout.type === filters.type);
    }

    // Filter by date range
    if (filters.dateFrom) {
      filtered = filtered.filter(workout => 
        new Date(workout.date) >= new Date(filters.dateFrom)
      );
    }
    if (filters.dateTo) {
      filtered = filtered.filter(workout => 
        new Date(workout.date) <= new Date(filters.dateTo)
      );
    }

    // Search by exercise name
    if (filters.search) {
      filtered = filtered.filter(workout =>
        workout.exercises.some(exercise =>
          exercise.name.toLowerCase().includes(filters.search.toLowerCase())
        )
      );
    }

    setFilteredWorkouts(filtered);
  };

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
        <div className="stats shadow bg-base-100 w-full">
          <div className="stat">
            <div className="stat-title">Total Workouts</div>
            <div className="stat-value">{workouts.length}</div>
          </div>
          <div className="stat">
            <div className="stat-title">This Month</div>
            <div className="stat-value text-primary">
              {workouts.filter(w => new Date(w.date).getMonth() === new Date().getMonth()).length}
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Average Duration</div>
            <div className="stat-value text-secondary">
              {Math.round(workouts.reduce((acc, w) => acc + w.duration, 0) / workouts.length || 0)}m
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="navbar bg-base-100 rounded-box shadow">
          <div className="flex-1">
            <div className="form-control">
              <input
                type="text"
                placeholder="Search workouts..."
                className="input input-bordered w-full max-w-xs"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
          </div>
          <div className="flex-none gap-2">
            <Link href="/workouts/templates" className="btn btn-ghost">
              Templates
            </Link>
            <Link href="/workouts/create" className="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
              New Workout
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="collapse bg-base-100 rounded-box shadow">
          <input type="checkbox" /> 
          <div className="collapse-title text-xl font-medium">
            Filters
          </div>
          <div className="collapse-content">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select 
                className="select select-bordered w-full"
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
              >
                <option value="all">All Types</option>
                <option value="strength">Strength</option>
                <option value="cardio">Cardio</option>
                <option value="hiit">HIIT</option>
              </select>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Date From</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Date To</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                />
              </div>
            </div>
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

        {/* Workouts Grid */}
        {filteredWorkouts.length === 0 ? (
          <div className="hero bg-base-100 rounded-box shadow-xl py-12">
            <div className="hero-content text-center">
              <div className="max-w-md">
                <h2 className="text-2xl font-bold mb-4">No Workouts Found</h2>
                <p className="mb-6">Start tracking your fitness journey by logging your first workout!</p>
                <Link href="/workouts/create" className="btn btn-primary">
                  Log Your First Workout
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredWorkouts.map((workout) => (
              <div key={workout._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                <div className="card-body">
                  <h2 className="card-title">
                    {new Date(workout.date).toLocaleDateString()}
                    <div className="badge badge-secondary">{workout.duration}min</div>
                  </h2>
                  
                  <div className="flex gap-2 my-2">
                    <div className="badge badge-outline capitalize">{workout.type}</div>
                    <div className="badge badge-outline">{workout.exercises.length} exercises</div>
                    {workout.template && (
                      <div className="badge badge-primary">Template</div>
                    )}
                  </div>

                  {workout.notes && (
                    <p className="text-sm opacity-70 mt-2">{workout.notes}</p>
                  )}

                  <div className="card-actions justify-end mt-4">
                    <Link href={`/workouts/${workout._id}`} className="btn btn-primary">
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