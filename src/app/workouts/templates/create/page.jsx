'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ExerciseSelect from '@/app/components/ExerciseSelect';

export default function CreateTemplate() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [template, setTemplate] = useState({
    templateName: '',
    type: 'strength',
    duration: 60,
    exercises: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/workouts/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template),
      });

      if (!res.ok) throw new Error('Failed to create template');
      router.push('/workouts/templates');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addExercise = () => {
    setTemplate({
      ...template,
      exercises: [...template.exercises, { name: '', sets: [{ reps: 0, weight: 0 }] }]
    });
  };

  const updateExerciseName = (exerciseIndex, name) => {
    const newExercises = [...template.exercises];
    newExercises[exerciseIndex] = {
      ...newExercises[exerciseIndex],
      name
    };
    setTemplate({ ...template, exercises: newExercises });
  };

  const removeExercise = (index) => {
    const newExercises = template.exercises.filter((_, idx) => idx !== index);
    setTemplate({ ...template, exercises: newExercises });
  };

  const addSet = (exerciseIndex) => {
    const newExercises = [...template.exercises];
    newExercises[exerciseIndex].sets.push({ reps: 0, weight: 0 });
    setTemplate({ ...template, exercises: newExercises });
  };

  const updateSet = (exerciseIndex, setIndex, field, value) => {
    const newExercises = [...template.exercises];
    newExercises[exerciseIndex].sets[setIndex][field] = Number(value);
    setTemplate({ ...template, exercises: newExercises });
  };

  const removeSet = (exerciseIndex, setIndex) => {
    const newExercises = [...template.exercises];
    newExercises[exerciseIndex].sets = newExercises[exerciseIndex].sets.filter((_, idx) => idx !== setIndex);
    setTemplate({ ...template, exercises: newExercises });
  };

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="navbar bg-base-100 rounded-box shadow">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Create Template</h1>
          </div>
          <div className="flex-none">
            <Link href="/workouts/templates" className="btn btn-ghost btn-sm">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Template Name</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={template.templateName}
                    onChange={(e) => setTemplate({...template, templateName: e.target.value})}
                    required
                  />
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Type</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={template.type}
                    onChange={(e) => setTemplate({...template, type: e.target.value})}
                  >
                    <option value="strength">Strength</option>
                    <option value="conditioning">Conditioning</option>
                    <option value="technique">Technique</option>
                    <option value="sparring">Sparring</option>
                  </select>
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Duration (minutes)</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={template.duration}
                    onChange={(e) => setTemplate({...template, duration: parseInt(e.target.value)})}
                    min="1"
                    required
                  />
                </div>
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
                Add Exercise
              </button>
            </div>

            {template.exercises.map((exercise, exerciseIndex) => (
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

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create Template'}
          </button>
        </form>
      </div>
    </div>
  );
} 