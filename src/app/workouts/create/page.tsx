'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    template: false,
    templateName: '',
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

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New Workout</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="alert alert-error">{error}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">Type</label>
              <select 
                className="select select-bordered"
                value={workout.type}
                onChange={(e) => setWorkout({...workout, type: e.target.value})}
              >
                <option value="strength">Strength</option>
                <option value="conditioning">Conditioning</option>
                <option value="technique">Technique</option>
                <option value="sparring">Sparring</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">Date</label>
              <input
                type="date"
                className="input input-bordered"
                value={workout.date}
                onChange={(e) => setWorkout({...workout, date: e.target.value})}
              />
            </div>

            <div className="form-control">
              <label className="label">Duration (minutes)</label>
              <input
                type="number"
                className="input input-bordered"
                value={workout.duration}
                onChange={(e) => setWorkout({...workout, duration: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div className="divider">Exercises</div>

          {workout.exercises.map((exercise, exerciseIndex) => (
            <div key={exerciseIndex} className="card bg-base-200 p-4 mb-4">
              <input
                type="text"
                placeholder="Exercise name"
                className="input input-bordered mb-2"
                value={exercise.name}
                onChange={(e) => {
                  const newExercises = [...workout.exercises];
                  newExercises[exerciseIndex].name = e.target.value;
                  setWorkout({...workout, exercises: newExercises});
                }}
              />

              {exercise.sets.map((set, setIndex) => (
                <div key={setIndex} className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
                  <input
                    type="number"
                    placeholder="Reps"
                    className="input input-bordered"
                    value={set.reps}
                    onChange={(e) => {
                      const newExercises = [...workout.exercises];
                      newExercises[exerciseIndex].sets[setIndex].reps = parseInt(e.target.value);
                      setWorkout({...workout, exercises: newExercises});
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Weight"
                    className="input input-bordered"
                    value={set.weight}
                    onChange={(e) => {
                      const newExercises = [...workout.exercises];
                      newExercises[exerciseIndex].sets[setIndex].weight = parseInt(e.target.value);
                      setWorkout({...workout, exercises: newExercises});
                    }}
                  />
                </div>
              ))}

              <button
                type="button"
                className="btn btn-secondary btn-sm mt-2"
                onClick={() => addSet(exerciseIndex)}
              >
                Add Set
              </button>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-secondary"
            onClick={addExercise}
          >
            Add Exercise
          </button>

          <div className="form-control">
            <label className="label">Notes</label>
            <textarea
              className="textarea textarea-bordered"
              value={workout.notes}
              onChange={(e) => setWorkout({...workout, notes: e.target.value})}
            />
          </div>

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Save as template</span>
              <input
                type="checkbox"
                className="checkbox"
                checked={workout.template}
                onChange={(e) => setWorkout({...workout, template: e.target.checked})}
              />
            </label>
          </div>

          {workout.template && (
            <div className="form-control">
              <label className="label">Template Name</label>
              <input
                type="text"
                className="input input-bordered"
                value={workout.templateName}
                onChange={(e) => setWorkout({...workout, templateName: e.target.value})}
              />
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? <span className="loading loading-spinner"></span> : 'Create Workout'}
          </button>
        </form>
      </div>
    </div>
  );
} 