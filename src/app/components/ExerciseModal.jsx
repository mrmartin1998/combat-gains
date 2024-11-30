'use client';
import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

export default function ExerciseModal({ isOpen, onClose, onSelect }) {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [equipmentFilter, setEquipmentFilter] = useState('all');

  useEffect(() => {
    if (isOpen) {
      fetchExercises();
    }
  }, [isOpen]);

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
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || exercise.type === typeFilter;
    const matchesEquipment = equipmentFilter === 'all' || exercise.equipment === equipmentFilter;
    return matchesSearch && matchesType && matchesEquipment;
  });

  return (
    <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box w-11/12 max-w-5xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Select Exercise</h3>
          <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>✕</button>
        </div>

        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control">
              <div className="input-group">
                <span>
                  <Search className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search exercises..."
                  className="input input-bordered w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <select
              className="select select-bordered w-full"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="strength">Strength</option>
              <option value="cardio">Cardio</option>
              <option value="flexibility">Flexibility</option>
              <option value="power">Power</option>
              <option value="olympic_lifting">Olympic Lifting</option>
            </select>

            <select
              className="select select-bordered w-full"
              value={equipmentFilter}
              onChange={(e) => setEquipmentFilter(e.target.value)}
            >
              <option value="all">All Equipment</option>
              <option value="barbell">Barbell</option>
              <option value="dumbbell">Dumbbell</option>
              <option value="machine">Machine</option>
              <option value="bodyweight">Bodyweight</option>
              <option value="cables">Cables</option>
              <option value="kettlebell">Kettlebell</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Exercise List */}
          {loading ? (
            <div className="text-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : error ? (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          ) : filteredExercises.length === 0 ? (
            <div className="text-center py-8 text-base-content/60">
              No exercises found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredExercises.map((exercise) => (
                <div
                  key={exercise._id}
                  className="card bg-base-200 hover:bg-base-300 cursor-pointer transition-colors"
                  onClick={() => onSelect(exercise)}
                >
                  <div className="card-body">
                    <h2 className="card-title">{exercise.name}</h2>
                    <div className="flex gap-2">
                      <div className="badge badge-outline">{exercise.equipment}</div>
                      <div className="badge badge-outline">{exercise.type}</div>
                    </div>
                    {exercise.description && (
                      <p className="text-sm opacity-70">{exercise.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
} 