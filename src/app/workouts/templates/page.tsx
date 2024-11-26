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
  const [searchTerm, setSearchTerm] = useState('');

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
        {/* Header with Stats */}
        <div className="stats shadow bg-base-100 w-full">
          <div className="stat">
            <div className="stat-title">Total Templates</div>
            <div className="stat-value">{templates.length}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Most Used Type</div>
            <div className="stat-value text-primary">Strength</div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="navbar bg-base-100 rounded-box shadow">
          <div className="flex-1">
            <div className="form-control">
              <input
                type="text"
                placeholder="Search templates..."
                className="input input-bordered w-full max-w-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-none">
            <Link href="/workouts/create" className="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
              New Template
            </Link>
          </div>
        </div>

        {error && (
          <div role="alert" className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Templates Grid */}
        <div className="grid gap-4">
          {templates.map((template) => (
            <div key={template._id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">
                  {template.templateName}
                  <div className="badge badge-secondary">{template.type}</div>
                </h2>
                
                <div className="flex gap-2 my-2">
                  <div className="badge badge-outline">{template.duration} min</div>
                  <div className="badge badge-outline">{template.exercises.length} exercises</div>
                </div>

                {template.exercises.length > 0 && (
                  <div className="collapse collapse-plus bg-base-200">
                    <input type="checkbox" /> 
                    <div className="collapse-title font-medium">
                      View Exercises
                    </div>
                    <div className="collapse-content">
                      <div className="flex flex-wrap gap-2">
                        {template.exercises.map((exercise, idx) => (
                          <span key={idx} className="badge">{exercise.name}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {template.notes && (
                  <p className="text-sm opacity-70">{template.notes}</p>
                )}

                <div className="card-actions justify-end mt-4">
                  <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-circle btn-ghost">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                    </label>
                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                      <li><button onClick={() => useTemplate(template._id)}>Use Template</button></li>
                      <li><Link href={`/workouts/templates/${template._id}/edit`}>Edit Template</Link></li>
                      <li><button onClick={() => deleteTemplate(template._id)} className="text-error">Delete Template</button></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {templates.length === 0 && !loading && (
          <div className="alert">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>No templates found. Create your first template to get started!</span>
          </div>
        )}
      </div>
    </div>
  );
} 