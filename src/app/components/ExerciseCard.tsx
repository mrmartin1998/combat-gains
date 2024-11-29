'use client';
import { useState } from 'react';
import { Trash2, GripVertical, Copy, History } from 'lucide-react';

interface Set {
  reps: number;
  weight: number;
  notes?: string;
}

interface Exercise {
  name: string;
  sets: Set[];
  notes?: string;
}

interface Props {
  exercise: Exercise;
  exerciseIndex: number;
  onUpdate: (index: number, exercise: Exercise) => void;
  onDelete: (index: number) => void;
  onDuplicate?: (index: number) => void;
  showLastWorkout?: boolean;
}

export default function ExerciseCard({ 
  exercise, 
  exerciseIndex, 
  onUpdate, 
  onDelete,
  onDuplicate,
  showLastWorkout = false 
}: Props) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const updateSet = (setIndex: number, field: keyof Set, value: number) => {
    const updatedSets = [...exercise.sets];
    updatedSets[setIndex] = { ...updatedSets[setIndex], [field]: value };
    onUpdate(exerciseIndex, { ...exercise, sets: updatedSets });
  };

  const addSet = () => {
    const lastSet = exercise.sets[exercise.sets.length - 1];
    const newSet = { ...lastSet }; // Copy last set's values
    onUpdate(exerciseIndex, {
      ...exercise,
      sets: [...exercise.sets, newSet]
    });
  };

  const removeSet = (setIndex: number) => {
    onUpdate(exerciseIndex, {
      ...exercise,
      sets: exercise.sets.filter((_, idx) => idx !== setIndex)
    });
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center gap-2">
          <button className="btn btn-ghost btn-sm p-0" onClick={() => setIsCollapsed(!isCollapsed)}>
            <GripVertical className="h-4 w-4" />
          </button>
          
          <h3 className="text-lg font-bold flex-1">{exercise.name}</h3>

          <div className="flex gap-1">
            {showLastWorkout && (
              <button className="btn btn-ghost btn-sm" title="Load last workout">
                <History className="h-4 w-4" />
              </button>
            )}
            {onDuplicate && (
              <button 
                className="btn btn-ghost btn-sm" 
                onClick={() => onDuplicate(exerciseIndex)}
                title="Duplicate exercise"
              >
                <Copy className="h-4 w-4" />
              </button>
            )}
            <button 
              className="btn btn-ghost btn-sm" 
              onClick={() => onDelete(exerciseIndex)}
              title="Remove exercise"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!isCollapsed && (
          <>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Set</th>
                    <th>Previous</th>
                    <th>Weight (kg)</th>
                    <th>Reps</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {exercise.sets.map((set, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td className="text-sm opacity-70">
                        8 × 60kg
                      </td>
                      <td>
                        <input
                          type="number"
                          className="input input-bordered input-sm w-20 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          value={set.weight}
                          onChange={(e) => updateSet(idx, 'weight', parseFloat(e.target.value) || 0)}
                          step="2.5"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="input input-bordered input-sm w-20 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          value={set.reps}
                          onChange={(e) => updateSet(idx, 'reps', parseInt(e.target.value) || 0)}
                        />
                      </td>
                      <td>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => removeSet(idx)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={addSet}
              >
                Add Set
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 