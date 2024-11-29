'use client';
import { useState, useEffect } from 'react';

interface Exercise {
  _id: string;
  name: string;
  primaryMuscles: string[];
  equipment: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function ExerciseSelect({ value, onChange, className = '' }: Props) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
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

      const res = await fetch(`/api/exercises?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch exercises');
      const data = await res.json();
      setExercises(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredExercises = exercises.filter(exercise =>
    exercise.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading loading-spinner loading-sm"></div>;
  if (error) return <div className="text-error">Error loading exercises</div>;

  return (
    <div className="space-y-2 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <input
          type="text"
          placeholder="Search exercises..."
          className={`input input-bordered w-full ${className}`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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

      <ul className="menu bg-base-100 w-full rounded-box max-h-60 overflow-y-auto">
        {filteredExercises.map((exercise) => (
          <li key={exercise._id}>
            <button
              type="button"
              onClick={() => {
                onChange(exercise.name);
                setSearch('');
              }}
              className="flex justify-between items-center"
            >
              <span>{exercise.name}</span>
              <div className="flex gap-2">
                {exercise.primaryMuscles.map(muscle => (
                  <span key={muscle} className="badge badge-sm">{muscle}</span>
                ))}
                <span className="badge badge-sm badge-outline">{exercise.equipment}</span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
} 