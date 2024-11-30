'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ExerciseDetails({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exercise, setExercise] = useState(null);

  useEffect(() => {
    async function fetchExercise() {
      try {
        const response = await fetch(`/api/exercises/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch exercise');
        const data = await response.json();
        setExercise(data);
      } catch (err) {
        setError('Failed to load exercise');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchExercise();
  }, [params.id]);

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

  if (!exercise) {
    return (
      <div className="min-h-screen bg-base-200 p-4">
        <div className="alert alert-info">
          <span>Exercise not found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="navbar bg-base-100 rounded-box shadow">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{exercise.name}</h1>
          </div>
          <div className="flex-none gap-2">
            <Link 
              href={`/exercises/${params.id}/edit`} 
              className="btn btn-primary btn-sm"
            >
              Edit
            </Link>
            <Link href="/exercises" className="btn btn-ghost btn-sm">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Equipment</label>
                  <p className="capitalize">{exercise.equipment}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <p className="capitalize">{exercise.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <p>{exercise.description}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Muscles Worked</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Primary Muscles</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {exercise.primaryMuscles.map(muscle => (
                      <span key={muscle} className="badge badge-primary">{muscle}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Secondary Muscles</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {exercise.secondaryMuscles.map(muscle => (
                      <span key={muscle} className="badge">{muscle}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Instructions</h2>
            <ol className="list-decimal list-inside space-y-2">
              {exercise.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 