'use client';
import { useState } from 'react';
import ExerciseSelect from './ExerciseSelect';

export default function ExerciseCard({ 
  exercise, 
  exerciseIndex, 
  onUpdate, 
  onDelete,
  onDuplicate,
  showLastWorkout = false,
  previousData = null
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const addSet = () => {
    const updatedExercise = {
      ...exercise,
      sets: [...exercise.sets, { reps: 0, weight: 0 }]
    };
    onUpdate(exerciseIndex, updatedExercise);
  };

  const updateSet = (setIndex, field, value) => {
    const updatedSets = [...exercise.sets];
    updatedSets[setIndex] = {
      ...updatedSets[setIndex],
      [field]: value
    };
    onUpdate(exerciseIndex, { ...exercise, sets: updatedSets });
  };

  const removeSet = (setIndex) => {
    const updatedSets = exercise.sets.filter((_, idx) => idx !== setIndex);
    onUpdate(exerciseIndex, { ...exercise, sets: updatedSets });
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center gap-4">
          <div className="flex-1">
            <ExerciseSelect
              value={exercise.name}
              onChange={(name) => onUpdate(exerciseIndex, { ...exercise, name })}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            {onDuplicate && (
              <button
                type="button"
                className="btn btn-square btn-ghost btn-sm"
                onClick={() => onDuplicate(exerciseIndex)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            )}
            <button
              type="button"
              className="btn btn-square btn-ghost btn-sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button
              type="button"
              className="btn btn-square btn-ghost btn-sm"
              onClick={() => onDelete(exerciseIndex)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
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
                        {previousData ? 
                          `${previousData.reps} × ${previousData.weight}kg` : 
                          '-'
                        }
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
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => removeSet(idx)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-4">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={addSet}
              >
                Add Set
              </button>
            </div>

            <div className="form-control mt-4">
              <textarea
                placeholder="Exercise notes"
                className="textarea textarea-bordered"
                value={exercise.notes || ''}
                onChange={(e) => onUpdate(exerciseIndex, { ...exercise, notes: e.target.value })}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
} 