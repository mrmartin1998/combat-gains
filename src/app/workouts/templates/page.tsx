'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
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

interface Template {
  _id: string;
  type: string;
  templateName: string;
  exercises: Exercise[];
  duration: number;
  notes?: string;
}

export default function WorkoutTemplates() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/workouts/templates');
      if (!res.ok) throw new Error('Failed to fetch templates');
      const data = await res.json();
      setTemplates(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const useTemplate = async (templateId: string) => {
    try {
      const res = await fetch(`/api/workouts/templates/${templateId}/use`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to create workout from template');
      const workout = await res.json();
      router.push(`/workouts/${workout._id}`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    
    try {
      const res = await fetch(`/api/workouts/templates/${templateId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete template');
      setTemplates(templates.filter(t => t._id !== templateId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="loading loading-spinner"></div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Workout Templates</h1>
          <Link href="/workouts/create" className="btn btn-primary">
            Create New Template
          </Link>
        </div>

        <div className="space-y-4">
          {templates.map((template) => (
            <div key={template._id} className="card bg-base-200">
              <div className="card-body">
                <h2 className="card-title">{template.templateName}</h2>
                <p className="capitalize">{template.type} Workout</p>
                <p>Duration: {template.duration} minutes</p>
                <p>Exercises: {template.exercises.length}</p>
                {template.notes && <p className="text-sm">Notes: {template.notes}</p>}
                
                <div className="card-actions justify-end mt-4">
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => deleteTemplate(template._id)}
                  >
                    Delete
                  </button>
                  <Link
                    href={`/workouts/templates/${template._id}/edit`}
                    className="btn btn-secondary btn-sm"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => useTemplate(template._id)}
                  >
                    Use Template
                  </button>
                </div>
              </div>
            </div>
          ))}

          {templates.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No templates found. Create your first template!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 