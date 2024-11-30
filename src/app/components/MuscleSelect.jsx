'use client';
import { useState } from 'react';

export default function MuscleSelect({ 
  label, 
  selected = [], 
  onChange, 
  className = '',
  multiple = true 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const muscles = [
    'Chest',
    'Back',
    'Shoulders',
    'Biceps',
    'Triceps',
    'Forearms',
    'Quadriceps',
    'Hamstrings',
    'Calves',
    'Glutes',
    'Core',
    'Traps',
    'Lats'
  ];

  const handleSelect = (muscle) => {
    if (multiple) {
      const newSelected = selected.includes(muscle)
        ? selected.filter(m => m !== muscle)
        : [...selected, muscle];
      onChange(newSelected);
    } else {
      onChange([muscle]);
      setIsOpen(false);
    }
  };

  return (
    <div className={`dropdown ${isOpen ? 'dropdown-open' : ''} ${className}`}>
      <div 
        tabIndex={0} 
        role="button" 
        className="input input-bordered w-full flex items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex-1 text-left">
          {selected.length > 0 ? selected.join(', ') : `Select ${label}...`}
        </span>
      </div>
      
      <div className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full">
        <ul className="menu">
          {muscles.map((muscle) => (
            <li key={muscle}>
              <button
                type="button"
                onClick={() => handleSelect(muscle)}
                className={`flex items-center gap-2 ${selected.includes(muscle) ? 'active' : ''}`}
              >
                <input
                  type={multiple ? "checkbox" : "radio"}
                  checked={selected.includes(muscle)}
                  className={multiple ? "checkbox checkbox-sm" : "radio radio-sm"}
                  onChange={() => {}}
                />
                {muscle}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 