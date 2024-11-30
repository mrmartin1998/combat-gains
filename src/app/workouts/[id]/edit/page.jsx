'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';
import ExerciseSelect from '@/app/components/ExerciseSelect';

export default function EditWorkout({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [workout, setWorkout] = useState({
    type: 'strength',
    date: new Date().toISOString().split('T')[0],
    duration: 60,
    exercises: [],
    notes: ''
  });

  useEffect(() => {
    const fetchWorkout = async () => {
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
    };
  
    fetchWorkout();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/workouts/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workout),
      });

      if (!res.ok) throw new Error('Failed to update workout');
      router.push(`/workouts/${params.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addExercise = () => {
    setWorkout({
      ...workout,
      exercises: [...workout.exercises, { name: '', sets: [{ reps: 0, weight: 0, notes: '' }] }]
    });
  };

  const updateExerciseName = (exerciseIndex, name) => {
    const newExercises = [...workout.exercises];
    newExercises[exerciseIndex] = {
      ...newExercises[exerciseIndex],
      name
    };
    setWorkout({ ...workout, exercises: newExercises });
  };

  const addSet = (exerciseIndex) => {
    const newExercises = [...workout.exercises];
    newExercises[exerciseIndex].sets.push({ reps: 0, weight: 0, notes: '' });
    setWorkout({ ...workout, exercises: newExercises });
  };

  const updateSet = (exerciseIndex, setIndex, field, value) => {
    const newExercises = [...workout.exercises];
    newExercises[exerciseIndex].sets[setIndex] = {
      ...newExercises[exerciseIndex].sets[setIndex],
      [field]: field === 'notes' ? value : Number(value)
    };
    setWorkout({ ...workout, exercises: newExercises });
  };

  const removeSet = (exerciseIndex, setIndex) => {
    const newExercises = [...workout.exercises];
    newExercises[exerciseIndex].sets = newExercises[exerciseIndex].sets.filter((_, idx) => idx !== setIndex);
    setWorkout({ ...workout, exercises: newExercises });
  };

  const updateExerciseNotes = (exerciseIndex, notes) => {
    const newExercises = [...workout.exercises];
    newExercises[exerciseIndex] = {
      ...newExercises[exerciseIndex],
      notes
    };
    setWorkout({ ...workout, exercises: newExercises });
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
            <h1 className="text-2xl font-bold">Edit Workout</h1>
          </div>
          <div className="flex-none">
            <Link href={`/workouts/${params.id}`} className="btn btn-ghost">
              Cancel
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Type</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={workout.type}
                    onChange={(e) => setWorkout({ ...workout, type: e.target.value })}
                  >
                    <option value="strength">Strength</option>
                    <option value="cardio">Cardio</option>
                    <option value="hiit">HIIT</option>
                    <option value="flexibility">Flexibility</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Date</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered"
                    value={workout.date}
                    onChange={(e) => setWorkout({ ...workout, date: e.target.value })}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Duration (minutes)</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={workout.duration}
                    onChange={(e) => setWorkout({ ...workout, duration: Number(e.target.value) })}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Notes</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24"
                  value={workout.notes}
                  onChange={(e) => setWorkout({ ...workout, notes: e.target.value })}
                  placeholder="Workout notes..."
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Exercises</h2>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={addExercise}
              >
                <Plus className="h-4 w-4" />
                Add Exercise
              </button>
            </div>

            {workout.exercises.map((exercise, exerciseIndex) => (
              <div key={exerciseIndex} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex justify-between items-center">
                    <ExerciseSelect
                      value={exercise.name}
                      onChange={(name) => updateExerciseName(exerciseIndex, name)}
                      className="w-full max-w-xs"
                    />
                    <button
                      type="button"
                      className="btn btn-square btn-ghost"
                      onClick={() => {
                        const newExercises = workout.exercises.filter((_, idx) => idx !== exerciseIndex);
                        setWorkout({ ...workout, exercises: newExercises });
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      <thead>
                        <tr>
                          <th>Set</th>
                          <th>Reps</th>
                          <th>Weight (kg)</th>
                          <th>Notes</th>
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
                                className="input input-bordered w-20"
                                value={set.reps}
                                onChange={(e) => updateSet(exerciseIndex, setIndex, 'reps', e.target.value)}
                                min="0"
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="input input-bordered w-20"
                                value={set.weight}
                                onChange={(e) => updateSet(exerciseIndex, setIndex, 'weight', e.target.value)}
                                min="0"
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="input input-bordered w-full"
                                value={set.notes || ''}
                                onChange={(e) => updateSet(exerciseIndex, setIndex, 'notes', e.target.value)}
                                placeholder="Set notes..."
                              />
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-ghost btn-sm"
                                onClick={() => removeSet(exerciseIndex, setIndex)}
                                disabled={exercise.sets.length === 1}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    type="button"
                    onClick={() => addSet(exerciseIndex)}
                    className="btn btn-outline btn-sm mt-2"
                  >
                    Add Set
                  </button>

                  <textarea
                    placeholder="Exercise notes"
                    className="textarea textarea-bordered mt-2"
                    value={exercise.notes || ''}
                    onChange={(e) => updateExerciseNotes(exerciseIndex, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
} 