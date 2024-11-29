'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ExerciseSelect from '@/app/components/ExerciseSelect';

interface Exercise {
  name: string;
  sets: {
    reps: number;
    weight: number;
    notes?: string;
  }[];
  notes?: string;
}

export default function CreateWorkout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [workout, setWorkout] = useState({
    type: 'strength',
    date: new Date().toISOString().split('T')[0],
    duration: 60,
    exercises: [] as Exercise[],
    notes: '',
  });

  const addExercise = () => {
    setWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, { name: '', sets: [{ reps: 0, weight: 0 }], notes: '' }],
    }));
  };

  const addSet = (exerciseIndex: number) => {
    const newExercises = [...workout.exercises];
    newExercises[exerciseIndex].sets.push({ reps: 0, weight: 0 });
    setWorkout({ ...workout, exercises: newExercises });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workout),
      });

      if (!res.ok) throw new Error('Failed to create workout');

      router.push('/workouts');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="navbar bg-base-100 rounded-box shadow">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Create New Workout</h1>
          </div>
          <div className="flex-none">
            <Link href="/workouts" className="btn btn-ghost">
              Cancel
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Workout Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Type</span>
                  </label>
                  <select 
                    className="select select-bordered w-full"
                    value={workout.type}
                    onChange={(e) => setWorkout({...workout, type: e.target.value})}
                  >
                    <option value="strength">Strength</option>
                    <option value="conditioning">Conditioning</option>
                    <option value="technique">Technique</option>
                    <option value="sparring">Sparring</option>
                  </select>
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Date</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    value={workout.date}
                    onChange={(e) => setWorkout({...workout, date: e.target.value})}
                  />
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Duration (minutes)</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={workout.duration}
                    onChange={(e) => setWorkout({...workout, duration: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="divider">Exercises</div>

          {workout.exercises.map((exercise, exerciseIndex) => (
            <div key={exerciseIndex} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-center">
                  <ExerciseSelect
                    value={exercise.name}
                    onChange={(name) => {
                      const newExercises = [...workout.exercises];
                      newExercises[exerciseIndex].name = name;
                      setWorkout({...workout, exercises: newExercises});
                    }}
                    className="w-full max-w-xs"
                  />
                  <button
                    type="button"
                    className="btn btn-square btn-ghost"
                    onClick={() => {
                      const newExercises = workout.exercises.filter((_, idx) => idx !== exerciseIndex);
                      setWorkout({...workout, exercises: newExercises});
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>Set</th>
                        <th>Reps</th>
                        <th>Weight (kg)</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exercise.sets.map((set, setIndex) => (
                        <tr key={setIndex}>
                          <td>{setIndex + 1}</td>
                          <td>
                            <input
                              type="number"
                              className="input input-bordered input-sm w-20"
                              value={set.reps}
                              onChange={(e) => {
                                const newExercises = [...workout.exercises];
                                newExercises[exerciseIndex].sets[setIndex].reps = parseInt(e.target.value);
                                setWorkout({...workout, exercises: newExercises});
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="input input-bordered input-sm w-20"
                              value={set.weight}
                              onChange={(e) => {
                                const newExercises = [...workout.exercises];
                                newExercises[exerciseIndex].sets[setIndex].weight = parseInt(e.target.value);
                                setWorkout({...workout, exercises: newExercises});
                              }}
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-ghost btn-sm"
                              onClick={() => {
                                const newExercises = [...workout.exercises];
                                newExercises[exerciseIndex].sets = exercise.sets.filter((_, idx) => idx !== setIndex);
                                setWorkout({...workout, exercises: newExercises});
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  type="button"
                  className="btn btn-ghost btn-sm w-full mt-2"
                  onClick={() => addSet(exerciseIndex)}
                >
                  Add Set
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-primary w-full"
            onClick={addExercise}
          >
            Add Exercise
          </button>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Additional Details</h2>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Notes</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24"
                  placeholder="Add any notes about this workout..."
                  value={workout.notes}
                  onChange={(e) => setWorkout({...workout, notes: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body flex-row justify-end gap-2">
              <Link href="/workouts" className="btn btn-ghost">
                Cancel
              </Link>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <span className="loading loading-spinner"></span> : 'Save Workout'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 