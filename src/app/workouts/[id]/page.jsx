'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Pencil } from 'lucide-react';

export default function WorkoutDetails({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [workout, setWorkout] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    async function fetchWorkout() {
      try {
        const response = await fetch(`/api/workouts/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch workout');
        const data = await response.json();
        setWorkout(data);
      } catch (err) {
        setError('Failed to load workout');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchWorkout();
  }, [params.id]);

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/workouts/${params.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete workout');
      router.push('/workouts');
    } catch (err) {
      setError(err.message);
      setShowDeleteModal(false);
    }
  };

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
        <div className="alert alert-error max-w-4xl mx-auto">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!workout) return null;

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="navbar bg-base-100 rounded-box shadow">
          <div className="flex-1">
            <Link href="/workouts" className="btn btn-ghost btn-sm">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </div>
          <div className="flex-none gap-2">
            <Link
              href={`/workouts/${params.id}/edit`}
              className="btn btn-ghost btn-sm"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Link>
            <button
              className="btn btn-error btn-sm"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </button>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Workout Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="font-bold">Type:</span>
                <span className="ml-2 capitalize">{workout.type}</span>
              </div>
              <div>
                <span className="font-bold">Date:</span>
                <span className="ml-2">
                  {new Date(workout.date).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="font-bold">Duration:</span>
                <span className="ml-2">{workout.duration} minutes</span>
              </div>
            </div>
            {workout.notes && (
              <div className="mt-4">
                <span className="font-bold">Notes:</span>
                <p className="mt-2 whitespace-pre-wrap">{workout.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Exercises</h2>
          {workout.exercises.map((exercise, index) => (
            <div key={index} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">{exercise.name}</h3>
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Set</th>
                        <th>Reps</th>
                        <th>Weight (kg)</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exercise.sets.map((set, setIdx) => (
                        <tr key={setIdx}>
                          <td>{setIdx + 1}</td>
                          <td>{set.reps}</td>
                          <td>{set.weight}</td>
                          <td>{set.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <dialog className={`modal ${showDeleteModal ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete Workout</h3>
          <p className="py-4">Are you sure you want to delete this workout? This action cannot be undone.</p>
          <div className="modal-action">
            <button className="btn" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </button>
            <button className="btn btn-error" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setShowDeleteModal(false)}>close</button>
        </form>
      </dialog>
    </div>
  );
} 