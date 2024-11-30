'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TemplateDetails({ params }) {
  const router = useRouter();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    async function fetchTemplate() {
      try {
        const response = await fetch(`/api/workout-templates/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch template');
        const data = await response.json();
        setTemplate(data);
      } catch (err) {
        setError('Failed to load template');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTemplate();
  }, [params.id]);

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/workouts/templates/${params.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete template');
      router.push('/workouts/templates');
    } catch (err) {
      setError(err.message);
      setShowDeleteModal(false);
    }
  };

  const handleStartWorkout = () => {
    router.push(`/workouts/create?template=${params.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 p-4 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 p-4">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-base-200 p-4">
        <div className="alert alert-info">
          <span>Template not found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="navbar bg-base-100 rounded-box shadow">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{template.templateName}</h1>
          </div>
          <div className="flex-none gap-2">
            <button
              onClick={handleStartWorkout}
              className="btn btn-primary btn-sm"
            >
              Start Workout
            </button>
            <Link 
              href={`/workouts/templates/${params.id}/edit`}
              className="btn btn-ghost btn-sm"
            >
              Edit
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="btn btn-error btn-sm"
            >
              Delete
            </button>
            <Link href="/workouts/templates" className="btn btn-ghost btn-sm">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </div>
        </div>

        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-title">Type</div>
            <div className="stat-value text-lg capitalize">{template.type}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Duration</div>
            <div className="stat-value text-lg">{template.duration} min</div>
          </div>
          <div className="stat">
            <div className="stat-title">Exercises</div>
            <div className="stat-value text-lg">{template.exercises.length}</div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Exercises</h2>
          {template.exercises.map((exercise, idx) => (
            <div key={idx} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">{exercise.name}</h3>
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Set</th>
                        <th>Reps</th>
                        <th>Weight (kg)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exercise.sets.map((set, setIdx) => (
                        <tr key={setIdx}>
                          <td>{setIdx + 1}</td>
                          <td>{set.reps}</td>
                          <td>{set.weight}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <dialog className={`modal ${showDeleteModal ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete Template</h3>
          <p className="py-4">Are you sure you want to delete this template? This action cannot be undone.</p>
          <div className="modal-action">
            <button className="btn" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </button>
            <button className="btn btn-error" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setShowDeleteModal(false)}>close</button>
        </form>
      </dialog>
    </div>
  );
} 