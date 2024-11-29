'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ExerciseSelect from '@/app/components/ExerciseSelect';
import ExerciseModal from '@/app/components/ExerciseModal';
import ExerciseCard from '@/app/components/ExerciseCard';
import { Exercise, Workout } from '@/app/types/workout';

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleExerciseSelect = async (selectedExercise: Exercise) => {
    const res = await fetch(`/api/workouts/last-set?exerciseName=${encodeURIComponent(selectedExercise.name)}`);
    const previousData = await res.json();

    setWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, {
        ...selectedExercise,
        sets: [{ reps: 0, weight: 0 }],
        previousData: previousData || null
      }]
    }));
    setIsModalOpen(false);
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

          {workout.exercises.map((exercise, index) => (
            <ExerciseCard
              key={index}
              exercise={exercise}
              exerciseIndex={index}
              onUpdate={(idx, updatedExercise) => {
                const newExercises = [...workout.exercises];
                newExercises[idx] = updatedExercise;
                setWorkout({ ...workout, exercises: newExercises });
              }}
              onDelete={(idx) => {
                setWorkout({
                  ...workout,
                  exercises: workout.exercises.filter((_, i) => i !== idx)
                });
              }}
            />
          ))}

          <button
            type="button"
            className="btn btn-primary w-full"
            onClick={() => setIsModalOpen(true)}
          >
            Add Exercise
          </button>

          <ExerciseModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSelect={handleExerciseSelect}
          />

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