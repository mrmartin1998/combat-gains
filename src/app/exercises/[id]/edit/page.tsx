'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ExerciseForm {
  name: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string;
  type: string;
  isPublic: boolean;
  description: string;
  instructions: string[];
}

export default function EditExercise({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [exercise, setExercise] = useState<ExerciseForm>({
    name: '',
    primaryMuscles: [],
    secondaryMuscles: [],
    equipment: '',
    type: '',
    isPublic: true,
    description: '',
    instructions: ['']
  });

  useEffect(() => {
    fetchExercise();
  }, [params.id]);

  const fetchExercise = async () => {
    try {
      const res = await fetch(`/api/exercises/${params.id}`);
      if (!res.ok) throw new Error('Failed to fetch exercise');
      const data = await res.json();
      setExercise(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addInstruction = () => {
    setExercise(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/exercises/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exercise),
      });

      if (!res.ok) throw new Error('Failed to update exercise');
      router.push('/exercises');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
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
            <h1 className="text-2xl font-bold">Edit Exercise</h1>
          </div>
          <div className="flex-none">
            <Link href="/exercises" className="btn btn-ghost">
              Cancel
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form content identical to create page */}
          {/* ... Copy all form fields from create page ... */}
          
          <div className="flex justify-end gap-2">
            <Link href="/exercises" className="btn btn-ghost">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 