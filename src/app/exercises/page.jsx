'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';

export default function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [muscleFilter, setMuscleFilter] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState('');

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const res = await fetch('/api/exercises');
      if (!res.ok) throw new Error('Failed to fetch exercises');
      const data = await res.json();
      setExercises(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscle = !muscleFilter || exercise.primaryMuscles.includes(muscleFilter);
    const matchesEquipment = !equipmentFilter || exercise.equipment === equipmentFilter;
    return matchesSearch && matchesMuscle && matchesEquipment;
  });

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
            <h1 className="text-2xl font-bold">Exercises</h1>
          </div>
          <div className="flex-none">
            <Link href="/exercises/create" className="btn btn-primary">
              <Plus className="h-4 w-4" />
              New Exercise
            </Link>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="form-control">
              <input
                type="text"
                placeholder="Search exercises..."
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select 
                className="select select-bordered w-full"
                value={muscleFilter}
                onChange={(e) => setMuscleFilter(e.target.value)}
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
                value={equipmentFilter}
                onChange={(e) => setEquipmentFilter(e.target.value)}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredExercises.map((exercise) => (
            <Link
              key={exercise._id}
              href={`/exercises/${exercise._id}`}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div className="card-body">
                <h2 className="card-title">{exercise.name}</h2>
                <div className="flex flex-wrap gap-2">
                  <div className="badge badge-outline">{exercise.equipment}</div>
                  <div className="badge badge-outline">{exercise.type}</div>
                </div>
                {exercise.description && (
                  <p className="text-sm opacity-70">{exercise.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 