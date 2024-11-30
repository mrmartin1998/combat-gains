'use client';
import { useState } from 'react';

export default function MuscleGroupSelect({ value, onChange, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const muscleGroups = [
    'Chest',
    'Back',
    'Shoulders',
    'Legs',
    'Arms',
    'Core',
    'Full Body'
  ];

  const handleSelect = (group) => {
    onChange(group);
    setIsOpen(false);
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
          {value || 'Select muscle group...'}
        </span>
      </div>
      
      <div className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full">
        <ul className="menu">
          {muscleGroups.map((group) => (
            <li key={group}>
              <button
                type="button"
                onClick={() => handleSelect(group)}
                className={value === group ? 'active' : ''}
              >
                {group}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 