'use client';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Exercise } from '@/app/types/exercise';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (exercise: Exercise) => void;
}

export default function ExerciseModal({ isOpen, onClose, onSelect }: Props) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('All Muscle Groups');
  const [equipment, setEquipment] = useState('All Equipment');

  useEffect(() => {
    if (isOpen) {
      fetchExercises();
    }
  }, [isOpen, muscleGroup, equipment]);

  const fetchExercises = async () => {
    try {
      const params = new URLSearchParams();
      if (muscleGroup !== 'All Muscle Groups') params.append('muscle', muscleGroup.toLowerCase());
      if (equipment !== 'All Equipment') params.append('equipment', equipment.toLowerCase());
      const response = await fetch(`/api/exercises?${params}`);
      const data = await response.json();
      setExercises(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredExercises = exercises.filter(exercise => 
    searchTerm ? exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) : true
  );

  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box w-11/12 max-w-4xl">
        <h3 className="font-bold text-lg mb-4">Select Exercise</h3>
        
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search exercises..."
              className="input input-bordered w-full pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-3 h-5 w-5 text-base-content/50" />
          </div>
          
          <select 
            className="select select-bordered"
            value={muscleGroup}
            onChange={(e) => setMuscleGroup(e.target.value)}
          >
            <option>All Muscle Groups</option>
            <option>Chest</option>
            <option>Back</option>
            <option>Legs</option>
            <option>Shoulders</option>
            <option>Arms</option>
            <option>Core</option>
          </select>

          <select 
            className="select select-bordered"
            value={equipment}
            onChange={(e) => setEquipment(e.target.value)}
          >
            <option>All Equipment</option>
            <option>Barbell</option>
            <option>Dumbbell</option>
            <option>Machine</option>
            <option>Bodyweight</option>
            <option>Cables</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="col-span-full flex justify-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            filteredExercises.map((exercise) => (
              <button 
                key={exercise._id}
                className="card bg-base-200 hover:bg-base-300 transition-colors"
                onClick={() => {
                  onSelect(exercise);
                  onClose();
                }}
              >
                <div className="card-body p-4">
                  <h3 className="card-title text-base">{exercise.name}</h3>
                  <div className="flex flex-wrap gap-1">
                    {exercise.primaryMuscles?.map((muscle) => (
                      <span key={muscle} className="badge badge-sm">{muscle}</span>
                    ))}
                    <span className="badge badge-sm">{exercise.equipment}</span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="modal-action">
          <button className="btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
} 