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

  if (loading) return <div className="loading loading-spinner"></div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!workout) return <div>Workout not found</div>;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold capitalize">{workout.type} Workout</h1>
          <Link href="/workouts" className="btn btn-ghost">
            Back to Workouts
          </Link>
        </div>

        <div className="card bg-base-200">
          <div className="card-body">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-semibold">Date</h3>
                <p>{new Date(workout.date).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="font-semibold">Duration</h3>
                <p>{workout.duration} minutes</p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-bold">Exercises</h2>
              {workout.exercises.map((exercise, idx) => (
                <div key={idx} className="card bg-base-100">
                  <div className="card-body">
                    <h3 className="card-title">{exercise.name}</h3>
                    <div className="overflow-x-auto">
                      <table className="table">
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
                      <div className="mt-2">
                        <p className="text-sm">Notes: {exercise.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {workout.notes && (
              <div className="mt-6">
                <h2 className="text-xl font-bold mb-2">Workout Notes</h2>
                <p>{workout.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 