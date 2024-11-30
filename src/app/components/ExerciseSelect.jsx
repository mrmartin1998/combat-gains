'use client';
import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

export default function ExerciseSelect({ value, onChange, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [exercises, setExercises] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchExercises();
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const fetchExercises = async () => {
    try {
      const res = await fetch('/api/exercises');
      if (!res.ok) throw new Error('Failed to fetch exercises');
      const data = await res.json();
      setExercises(data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  const filteredExercises = exercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div 
        className="input input-bordered flex items-center cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <Search className="w-4 h-4 mr-2 text-base-content/70" />
        <span className={value ? 'text-base-content' : 'text-base-content/70'}>
          {value || 'Select exercise...'}
        </span>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-base-100 rounded-lg shadow-xl border border-base-300">
          <input
            type="text"
            className="input input-bordered w-full rounded-t-lg rounded-b-none"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          <div className="max-h-60 overflow-y-auto">
            {filteredExercises.map((exercise) => (
              <div
                key={exercise._id}
                className="px-4 py-2 hover:bg-base-200 cursor-pointer"
                onClick={() => {
                  onChange(exercise.name);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
              >
                {exercise.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 