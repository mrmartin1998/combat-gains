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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [template, setTemplate] = useState<Template | null>(null);

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

  if (loading) return <div className="loading loading-spinner"></div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!template) return <div>Template not found</div>;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Edit Template</h1>
          <Link href="/workouts/templates" className="btn btn-ghost">
            Cancel
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">Template Name</label>
              <input
                type="text"
                className="input input-bordered"
                value={template.templateName}
                onChange={(e) => setTemplate({...template, templateName: e.target.value})}
              />
            </div>

            <div className="form-control">
              <label className="label">Type</label>
              <select 
                className="select select-bordered"
                value={template.type}
                onChange={(e) => setTemplate({...template, type: e.target.value})}
              >
                <option value="strength">Strength</option>
                <option value="conditioning">Conditioning</option>
                <option value="technique">Technique</option>
                <option value="sparring">Sparring</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">Duration (minutes)</label>
              <input
                type="number"
                className="input input-bordered"
                value={template.duration}
                onChange={(e) => setTemplate({...template, duration: parseInt(e.target.value)})}
              />
            </div>
          </div>

          {/* Reuse the exercise form section from create workout page */}
          {/* Reference lines 108-167 from src/app/workouts/create/page.tsx */}

          <div className="form-control">
            <label className="label">Notes</label>
            <textarea
              className="textarea textarea-bordered"
              value={template.notes}
              onChange={(e) => setTemplate({...template, notes: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? <span className="loading loading-spinner"></span> : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
} 