'use client';
import { useEffect, useState } from 'react';
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

interface Template {
  _id: string;
  type: string;
  templateName: string;
  duration: number;
  exercises: Exercise[];
  notes?: string;
}

export default function EditTemplate({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTemplate();
  }, []);

  const fetchTemplate = async () => {
    try {
      const res = await fetch(`/api/workouts/templates/${params.id}`);
      if (!res.ok) throw new Error('Failed to fetch template');
      const data = await res.json();
      setTemplate(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addExercise = () => {
    if (!template) return;
    setTemplate({
      ...template,
      exercises: [...template.exercises, { name: '', sets: [{ reps: 0, weight: 0 }], notes: '' }],
    });
  };

  const addSet = (exerciseIndex: number) => {
    if (!template) return;
    const newExercises = [...template.exercises];
    newExercises[exerciseIndex].sets.push({ reps: 0, weight: 0 });
    setTemplate({ ...template, exercises: newExercises });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!template) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/workouts/templates/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template),
      });

      if (!res.ok) throw new Error('Failed to update template');
      router.push('/workouts/templates');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateExerciseName = (exerciseIndex: number, name: string) => {
    const newExercises = [...template.exercises];
    newExercises[exerciseIndex] = {
      ...newExercises[exerciseIndex],
      name
    };
    setTemplate({ ...template, exercises: newExercises });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen p-4">
        <div className="alert alert-info">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Template not found</span>
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
            <h1 className="text-2xl font-bold">Edit Template</h1>
          </div>
          <div className="flex-none">
            <Link href="/workouts/templates" className="btn btn-ghost">
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
              <h2 className="card-title">Template Details</h2>
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
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="divider">Exercises</div>

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
                    onClick={() => {
                      const newExercises = template.exercises.filter((_, idx) => idx !== exerciseIndex);
                      setTemplate({...template, exercises: newExercises});
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Exercise Notes</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-16"
                    value={exercise.notes}
                    onChange={(e) => {
                      const newExercises = [...template.exercises];
                      newExercises[exerciseIndex].notes = e.target.value;
                      setTemplate({...template, exercises: newExercises});
                    }}
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-primary w-full"
            onClick={() => setTemplate({
              ...template,
              exercises: [...template.exercises, { name: '', sets: [], notes: '' }]
            })}
          >
            Add Exercise
          </button>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Additional Details</h2>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Template Notes</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24"
                  value={template.notes}
                  onChange={(e) => setTemplate({...template, notes: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body flex-row justify-end gap-2">
              <Link href="/workouts/templates" className="btn btn-ghost">
                Cancel
              </Link>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <span className="loading loading-spinner"></span> : 'Save Template'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 