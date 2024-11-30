'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';
import ExerciseSelect from '@/app/components/ExerciseSelect';

export default function CreateWorkout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [workout, setWorkout] = useState({
    type: 'strength',
    date: new Date().toISOString().split('T')[0],
    duration: 60,
    exercises: [],
    notes: ''
  });

  const handleSubmit = async (e) => {
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
      const data = await res.json();
      router.push(`/workouts/${data._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

  const removeExercise = (index) => {
    const newExercises = workout.exercises.filter((_, idx) => idx !== index);
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
            <h1 className="text-2xl font-bold">Create Workout</h1>
          </div>
          <div className="flex-none">
            <Link href="/workouts" className="btn btn-ghost btn-sm">
              <ArrowLeft className="h-4 w-4" />
              Back
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
                    required
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
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="form-control w-full mt-4">
                <label className="label justify-start">
                  <span className="label-text">Notes</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24"
                  value={workout.notes}
                  onChange={(e) => setWorkout({...workout, notes: e.target.value})}
                  placeholder="Any general notes about this workout..."
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Exercises</h2>
              <div className="flex justify-end mt-4 mb-4">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={addExercise}
                >
                  <Plus className="h-4 w-4" />
                  Add Exercise
                </button>
              </div>
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
                      onClick={() => removeExercise(exerciseIndex)}
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
                          <th className="text-center">Set</th>
                          <th className="text-center">Reps</th>
                          <th className="text-center">Weight (kg)</th>
                          <th className="text-left">Notes</th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {exercise.sets.map((set, setIndex) => (
                          <tr key={setIndex}>
                            <td className="text-center">{setIndex + 1}</td>
                            <td className="text-center">
                              <input
                                type="number"
                                className="input input-bordered w-20 text-center"
                                value={set.reps}
                                onChange={(e) => updateSet(exerciseIndex, setIndex, 'reps', e.target.value)}
                                min="0"
                              />
                            </td>
                            <td className="text-center">
                              <input
                                type="number"
                                className="input input-bordered w-20 text-center"
                                value={set.weight}
                                onChange={(e) => updateSet(exerciseIndex, setIndex, 'weight', e.target.value)}
                                min="0"
                              />
                            </td>
                            <td className="text-center">
                              <input
                                type="text"
                                className="input input-bordered w-full"
                                value={set.notes}
                                onChange={(e) => updateSet(exerciseIndex, setIndex, 'notes', e.target.value)}
                                placeholder="Set notes..."
                              />
                            </td>
                            <td className="text-center">
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

                  <div className="card-actions justify-end">
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => addSet(exerciseIndex)}
                    >
                      Add Set
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

                    <div className="flex justify-end mb-4">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={addExercise}
            >
              <Plus className="h-4 w-4" />
              Add Exercise
            </button>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create Workout'}
          </button>
        </form>
      </div>
    </div>
  );
} 