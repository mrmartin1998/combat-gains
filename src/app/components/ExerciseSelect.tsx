'use client';
import { useState, useEffect } from 'react';
import { Star, History } from 'lucide-react';

interface Exercise {
  _id: string;
  name: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string;
  type: string;
  isPublic: boolean;
}

interface Props {
  value: string;
  onChange: (name: string) => void;
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
  const [recentExercises, setRecentExercises] = useState<string[]>([]);
  const [favoriteExercises, setFavoriteExercises] = useState<string[]>([]);
  const [showRecent, setShowRecent] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    fetchExercises();
    loadRecentExercises();
    loadFavoriteExercises();
  }, [filters]);

  const loadRecentExercises = () => {
    const recent = localStorage.getItem('recentExercises');
    if (recent) setRecentExercises(JSON.parse(recent));
  };

  const loadFavoriteExercises = () => {
    const favorites = localStorage.getItem('favoriteExercises');
    if (favorites) setFavoriteExercises(JSON.parse(favorites));
  };

  const addToRecent = (exerciseName: string) => {
    const updated = [exerciseName, ...recentExercises.filter(name => name !== exerciseName)].slice(0, 5);
    setRecentExercises(updated);
    localStorage.setItem('recentExercises', JSON.stringify(updated));
  };

  const toggleFavorite = (exerciseName: string) => {
    const updated = favoriteExercises.includes(exerciseName)
      ? favoriteExercises.filter(name => name !== exerciseName)
      : [...favoriteExercises, exerciseName];
    setFavoriteExercises(updated);
    localStorage.setItem('favoriteExercises', JSON.stringify(updated));
  };

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
        <div className="relative">
          <input
            type="text"
            placeholder="Search exercises..."
            className={`input input-bordered w-full ${className}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="absolute right-2 top-2 flex gap-2">
            <button 
              className={`btn btn-ghost btn-sm ${showRecent ? 'btn-active' : ''}`}
              onClick={() => setShowRecent(!showRecent)}
            >
              <History className="h-4 w-4" />
            </button>
            <button 
              className={`btn btn-ghost btn-sm ${showFavorites ? 'btn-active' : ''}`}
              onClick={() => setShowFavorites(!showFavorites)}
            >
              <Star className="h-4 w-4" />
            </button>
          </div>
        </div>
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

      {showRecent && recentExercises.length > 0 && (
        <div className="bg-base-200 p-2 rounded-box">
          <h3 className="text-sm font-bold mb-2">Recently Used</h3>
          <div className="flex flex-wrap gap-2">
            {recentExercises.map(name => (
              <button
                key={name}
                onClick={() => onChange(name)}
                className="btn btn-sm"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}

      {showFavorites && favoriteExercises.length > 0 && (
        <div className="bg-base-200 p-2 rounded-box">
          <h3 className="text-sm font-bold mb-2">Favorites</h3>
          <div className="flex flex-wrap gap-2">
            {favoriteExercises.map(name => (
              <button
                key={name}
                onClick={() => onChange(name)}
                className="btn btn-sm"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}

      <ul className="menu bg-base-100 w-full rounded-box max-h-60 overflow-y-auto">
        {filteredExercises.map((exercise) => (
          <li key={exercise._id}>
            <button
              type="button"
              onClick={() => {
                onChange(exercise.name);
                addToRecent(exercise.name);
                setSearch('');
              }}
              className="flex justify-between items-center group"
            >
              <div className="flex items-center gap-2">
                <span>{exercise.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(exercise.name);
                  }}
                  className={`btn btn-ghost btn-xs ${favoriteExercises.includes(exercise.name) ? 'text-warning' : 'opacity-0 group-hover:opacity-100'}`}
                >
                  <Star className="h-3 w-3" />
                </button>
              </div>
              <div className="flex flex-col items-end text-xs">
                <div className="flex gap-1">
                  {exercise.primaryMuscles.map(muscle => (
                    <span key={muscle} className="badge badge-sm badge-primary">{muscle}</span>
                  ))}
                </div>
                {exercise.secondaryMuscles.length > 0 && (
                  <div className="flex gap-1">
                    {exercise.secondaryMuscles.map(muscle => (
                      <span key={muscle} className="badge badge-sm badge-secondary">{muscle}</span>
                    ))}
                  </div>
                )}
                <span className="badge badge-sm badge-outline mt-1">{exercise.equipment}</span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
} 