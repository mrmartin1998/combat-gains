'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Exercise {
  name: string;
  sets: {
    reps: number;
    weight: number;
    notes?: string;
  }[];
  notes?: string;
}

interface Workout {
  _id: string;
  type: string;
  date: string;
  duration: number;
  exercises: Exercise[];
  notes?: string;
}

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

  if (loading) return <div className="loading loading-spinner"></div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Workouts</h1>
          <Link href="/workouts/create" className="btn btn-primary">
            Create Workout
          </Link>
        </div>

        <div className="card bg-base-200 mb-6">
          <div className="card-body">
            <h2 className="card-title mb-4">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="form-control">
                <input
                  type="text"
                  placeholder="Search exercises..."
                  className="input input-bordered"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </div>

              <div className="form-control">
                <select 
                  className="select select-bordered"
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                >
                  <option value="all">All Types</option>
                  <option value="strength">Strength</option>
                  <option value="conditioning">Conditioning</option>
                  <option value="technique">Technique</option>
                  <option value="sparring">Sparring</option>
                </select>
              </div>

              <div className="form-control">
                <input
                  type="date"
                  className="input input-bordered"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                />
              </div>

              <div className="form-control">
                <input
                  type="date"
                  className="input input-bordered"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredWorkouts.map((workout) => (
            <div key={workout._id} className="card bg-base-200 hover:bg-base-300 cursor-pointer">
              <Link href={`/workouts/${workout._id}`}>
                <div className="card-body">
                  <h2 className="card-title capitalize">{workout.type} Workout</h2>
                  <p>Date: {new Date(workout.date).toLocaleDateString()}</p>
                  <p>Duration: {workout.duration} minutes</p>
                  <p>Exercises: {workout.exercises.length}</p>
                  {workout.notes && <p className="text-sm">Notes: {workout.notes}</p>}
                </div>
              </Link>
            </div>
          ))}

          {filteredWorkouts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No workouts found matching your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 