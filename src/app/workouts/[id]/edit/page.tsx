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
}

export default function EditWorkout({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [workout, setWorkout] = useState<Workout | null>(null);

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

  const addExercise = () => {
    if (!workout) return;
    setWorkout({
      ...workout,
      exercises: [...workout.exercises, { name: '', sets: [{ reps: 0, weight: 0 }], notes: '' }],
    });
  };

  const addSet = (exerciseIndex: number) => {
    if (!workout) return;
    const newExercises = [...workout.exercises];
    newExercises[exerciseIndex].sets.push({ reps: 0, weight: 0 });
    setWorkout({ ...workout, exercises: newExercises });
  };

  const updateExercise = (index: number, field: string, value: any) => {
    if (!workout) return;
    const newExercises = [...workout.exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setWorkout({ ...workout, exercises: newExercises });
  };

  const updateSet = (exerciseIndex: number, setIndex: number, field: string, value: any) => {
    if (!workout) return;
    const newExercises = [...workout.exercises];
    newExercises[exerciseIndex].sets[setIndex] = {
      ...newExercises[exerciseIndex].sets[setIndex],
      [field]: value,
    };
    setWorkout({ ...workout, exercises: newExercises });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workout) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/workouts/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workout),
      });

      if (!res.ok) throw new Error('Failed to update workout');

      router.push(`/workouts/${params.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!workout) return <div>Workout not found</div>;

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <option value="conditioning">Conditioning</option>
                <option value="technique">Technique</option>
                <option value="sparring">Sparring</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Date</span>
              </label>
              <input
                type="date"
                className="input input-bordered"
                value={workout.date.split('T')[0]}
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
                onChange={(e) => setWorkout({ ...workout, duration: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Notes</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24"
              value={workout.notes}
              onChange={(e) => setWorkout({ ...workout, notes: e.target.value })}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Exercises</h2>
              <button type="button" onClick={addExercise} className="btn btn-primary">
                Add Exercise
              </button>
            </div>

            {workout.exercises.map((exercise, exerciseIndex) => (
              <div key={exerciseIndex} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <input
                    type="text"
                    placeholder="Exercise name"
                    className="input input-bordered w-full"
                    value={exercise.name}
                    onChange={(e) => updateExercise(exerciseIndex, 'name', e.target.value)}
                  />

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
                        {exercise.sets.map((set, setIndex) => (
                          <tr key={setIndex}>
                            <td>{setIndex + 1}</td>
                            <td>
                              <input
                                type="number"
                                className="input input-bordered w-20"
                                value={set.reps}
                                onChange={(e) => updateSet(exerciseIndex, setIndex, 'reps', parseInt(e.target.value))}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="input input-bordered w-20"
                                value={set.weight}
                                onChange={(e) => updateSet(exerciseIndex, setIndex, 'weight', parseInt(e.target.value))}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="input input-bordered w-full"
                                value={set.notes || ''}
                                onChange={(e) => updateSet(exerciseIndex, setIndex, 'notes', e.target.value)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    type="button"
                    onClick={() => addSet(exerciseIndex)}
                    className="btn btn-outline btn-sm"
                  >
                    Add Set
                  </button>

                  <textarea
                    placeholder="Exercise notes"
                    className="textarea textarea-bordered"
                    value={exercise.notes || ''}
                    onChange={(e) => updateExercise(exerciseIndex, 'notes', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <Link href={`/workouts/${params.id}`} className="btn btn-ghost">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 