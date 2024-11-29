'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Exercise {
  _id: string;
  name: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string;
  type: string;
  isPublic: boolean;
  description: string;
  instructions: string[];
  createdBy: string;
}

export default function ExerciseDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 p-4 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <div className="min-h-screen bg-base-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error || 'Exercise not found'}</span>
          </div>
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
            <Link href={`/exercises/${params.id}/edit`} className="btn btn-ghost">
              Edit
            </Link>
            <Link href="/exercises" className="btn btn-ghost">
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
                  <span className="font-bold">Type:</span> {exercise.type}
                </div>
                <div>
                  <span className="font-bold">Equipment:</span> {exercise.equipment}
                </div>
                <div>
                  <span className="font-bold">Primary Muscles:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {exercise.primaryMuscles.map((muscle) => (
                      <span key={muscle} className="badge badge-primary">{muscle}</span>
                    ))}
                  </div>
                </div>
                {exercise.secondaryMuscles.length > 0 && (
                  <div>
                    <span className="font-bold">Secondary Muscles:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {exercise.secondaryMuscles.map((muscle) => (
                        <span key={muscle} className="badge badge-secondary">{muscle}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Description</h2>
              <p className="whitespace-pre-wrap">{exercise.description}</p>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Instructions</h2>
            <ol className="list-decimal list-inside space-y-2">
              {exercise.instructions.map((instruction, index) => (
                <li key={index} className="pl-2">{instruction}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 