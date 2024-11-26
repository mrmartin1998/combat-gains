'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  createdAt: string;
}

export default function WorkoutDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWorkout();
  }, []);

  const fetchWorkout = async () => {
    try {
      const res = await fetch(`/api/workouts/${params.id}`);
      if (!res.ok) throw new Error('Failed to fetch workout');
      const data = await res.json();
      setWorkout(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this workout?')) return;
    
    try {
      const res = await fetch(`/api/workouts/${params.id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error('Failed to delete workout');
      
      router.push('/workouts');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4">
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen p-4">
        <div className="alert alert-info">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Workout not found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="navbar bg-base-100 rounded-box shadow">
          <div className="flex-1">
            <h1 className="text-2xl font-bold capitalize">{workout.type} Workout</h1>
          </div>
          <div className="flex-none gap-2">
            <Link href={`/workouts/${workout._id}/edit`} className="btn btn-primary">
              Edit
            </Link>
            <button onClick={handleDelete} className="btn btn-error">
              Delete
            </button>
            <Link href="/workouts" className="btn btn-ghost">
              Go back
            </Link>
          </div>
        </div>

        {/* Workout Stats */}
        <div className="stats shadow bg-base-100 w-full">
          <div className="stat">
            <div className="stat-title">Date</div>
            <div className="stat-value text-lg">
              {new Date(workout.date).toLocaleDateString()}
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Duration</div>
            <div className="stat-value text-lg">{workout.duration} min</div>
          </div>
          <div className="stat">
            <div className="stat-title">Exercises</div>
            <div className="stat-value text-lg">{workout.exercises.length}</div>
          </div>
        </div>

        {/* Exercises */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Exercises</h2>
          {workout.exercises.map((exercise, idx) => (
            <div key={idx} className="collapse collapse-arrow bg-base-100 shadow-lg">
              <input type="checkbox" defaultChecked={idx === 0} /> 
              <div className="collapse-title text-xl font-medium flex items-center justify-between">
                <span>{exercise.name}</span>
                <div className="badge badge-primary">{exercise.sets.length} sets</div>
              </div>
              <div className="collapse-content">
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>Set</th>
                        <th>Reps</th>
                        <th>Weight</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exercise.sets.map((set, setIdx) => (
                        <tr key={setIdx}>
                          <td>{setIdx + 1}</td>
                          <td>{set.reps}</td>
                          <td>{set.weight}kg</td>
                          <td>{set.notes || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {exercise.notes && (
                  <div className="alert alert-info mt-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 h-6 w-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{exercise.notes}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {workout.notes && (
          <div className="alert bg-base-100 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-bold">Workout Notes</h3>
              <div className="text-sm">{workout.notes}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 