'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function WorkoutTemplates() {
  const [templates, setTemplates] = useState([]);
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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
            <h1 className="text-2xl font-bold">Workout Templates</h1>
          </div>
          <div className="flex-none">
            <Link href="/workouts/templates/create" className="btn btn-primary">
              <Plus className="h-4 w-4" />
              New Template
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <Link
              key={template._id}
              href={`/workouts/templates/${template._id}`}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div className="card-body">
                <h2 className="card-title">{template.templateName}</h2>
                <div className="flex flex-wrap gap-2">
                  <div className="badge badge-outline capitalize">{template.type}</div>
                  <div className="badge badge-outline">{template.duration} min</div>
                </div>
                <div className="text-sm opacity-70">
                  {template.exercises.length} exercises
                </div>
              </div>
            </Link>
          ))}
        </div>

        {templates.length === 0 && !error && (
          <div className="alert">
            <span>No templates found. Create your first workout template!</span>
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
} 