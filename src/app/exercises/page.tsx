'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Exercise {
  _id: string;
  name: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string;
  type: string;
  isCustom: boolean;
  isPublic: boolean;
  description?: string;
  instructions?: string[];
}

export default function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    muscle: '',
    equipment: ''
  });

  useEffect(() => {
    fetchExercises();
  }, [filters]);

  const fetchExercises = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.muscle) params.append('muscle', filters.muscle);
      if (filters.equipment) params.append('equipment', filters.equipment);

      const response = await fetch(`/api/exercises?${params}`);
      if (!response.ok) throw new Error('Failed to fetch exercises');
      const data = await response.json();
      setExercises(data);
    } catch (err) {
      setError('Error loading exercises');
      console.error(err);
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
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Exercise Library</h1>
          <Link href="/exercises/create" className="btn btn-primary">
            Create Exercise
          </Link>
        </div>

        {/* Filters */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select 
                className="select select-bordered w-full"
                value={filters.muscle}
                onChange={(e) => setFilters({...filters, muscle: e.target.value})}
              >
                <option value="">All Muscle Groups</option>
                <option value="chest">Chest</option>
                <option value="back">Back</option>
                <option value="shoulders">Shoulders</option>
                <option value="legs">Legs</option>
                <option value="arms">Arms</option>
                <option value="core">Core</option>
                <option value="full_body">Full Body</option>
              </select>

              <select 
                className="select select-bordered w-full"
                value={filters.equipment}
                onChange={(e) => setFilters({...filters, equipment: e.target.value})}
              >
                <option value="">All Equipment</option>
                <option value="barbell">Barbell</option>
                <option value="dumbbell">Dumbbell</option>
                <option value="machine">Machine</option>
                <option value="bodyweight">Bodyweight</option>
                <option value="cables">Cables</option>
                <option value="kettlebell">Kettlebell</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Exercise List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((exercise) => (
            <Link 
              key={exercise._id}
              href={`/exercises/${exercise._id}`}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div className="card-body">
                <h2 className="card-title">{exercise.name}</h2>
                <div className="flex flex-wrap gap-2">
                  {exercise.primaryMuscles.map((muscle) => (
                    <span key={muscle} className="badge badge-primary">{muscle}</span>
                  ))}
                </div>
                <p className="text-sm opacity-70">{exercise.equipment}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 