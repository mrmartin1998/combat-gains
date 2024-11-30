'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Trash2 } from 'lucide-react';

export default function EditExercise({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [exercise, setExercise] = useState({
    name: '',
    primaryMuscles: [],
    secondaryMuscles: [],
    equipment: '',
    type: '',
    isPublic: true,
    description: '',
    instructions: ['']
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const response = await fetch(`/api/exercises/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch exercise');
        const data = await response.json();
        setExercise(data);
      } catch (err) {
        setError('Failed to load exercise');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [params.id]);

  const addInstruction = () => {
    setExercise(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const updateInstruction = (index, value) => {
    const newInstructions = [...exercise.instructions];
    newInstructions[index] = value;
    setExercise({ ...exercise, instructions: newInstructions });
  };

  const removeInstruction = (index) => {
    const newInstructions = exercise.instructions.filter((_, idx) => idx !== index);
    setExercise({ ...exercise, instructions: newInstructions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/exercises/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exercise),
      });

      if (!res.ok) throw new Error('Failed to update exercise');
      router.push('/exercises');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/exercises/${params.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete exercise');
      router.push('/exercises');
    } catch (err) {
      setError(err.message);
      setShowDeleteModal(false);
    } finally {
      setSaving(false);
    }
  };

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
            <h1 className="text-2xl font-bold">Edit Exercise</h1>
          </div>
          <div className="flex-none gap-2">
            <button
              onClick={() => setShowDeleteModal(true)}
              className="btn btn-error btn-sm"
              disabled={saving}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
            <Link href="/exercises" className="btn btn-ghost btn-sm">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Basic Information</h2>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Exercise Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={exercise.name}
                  onChange={(e) => setExercise({...exercise, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24"
                  value={exercise.description}
                  onChange={(e) => setExercise({...exercise, description: e.target.value})}
                  placeholder="Brief description of the exercise..."
                />
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Target Muscles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Primary Muscles</span>
                  </label>
                  <select
                    multiple
                    className="select select-bordered h-32"
                    value={exercise.primaryMuscles}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => option.value);
                      setExercise({...exercise, primaryMuscles: values});
                    }}
                    required
                  >
                    <option value="chest">Chest</option>
                    <option value="back">Back</option>
                    <option value="shoulders">Shoulders</option>
                    <option value="legs">Legs</option>
                    <option value="arms">Arms</option>
                    <option value="core">Core</option>
                    <option value="full_body">Full Body</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Secondary Muscles</span>
                  </label>
                  <select
                    multiple
                    className="select select-bordered h-32"
                    value={exercise.secondaryMuscles}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => option.value);
                      setExercise({...exercise, secondaryMuscles: values});
                    }}
                  >
                    <option value="chest">Chest</option>
                    <option value="back">Back</option>
                    <option value="shoulders">Shoulders</option>
                    <option value="legs">Legs</option>
                    <option value="arms">Arms</option>
                    <option value="core">Core</option>
                    <option value="full_body">Full Body</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Exercise Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Equipment</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={exercise.equipment}
                    onChange={(e) => setExercise({...exercise, equipment: e.target.value})}
                    required
                  >
                    <option value="barbell">Barbell</option>
                    <option value="dumbbell">Dumbbell</option>
                    <option value="machine">Machine</option>
                    <option value="bodyweight">Bodyweight</option>
                    <option value="cables">Cables</option>
                    <option value="kettlebell">Kettlebell</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Exercise Type</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={exercise.type}
                    onChange={(e) => setExercise({...exercise, type: e.target.value})}
                    required
                  >
                    <option value="strength">Strength</option>
                    <option value="cardio">Cardio</option>
                    <option value="flexibility">Flexibility</option>
                    <option value="power">Power</option>
                    <option value="olympic_lifting">Olympic Lifting</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <h2 className="card-title">Instructions</h2>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={addInstruction}
                >
                  Add Step
                </button>
              </div>
              
              <div className="space-y-4">
                {exercise.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="form-control flex-1">
                      <div className="input-group">
                        <span>{index + 1}</span>
                        <input
                          type="text"
                          className="input input-bordered w-full"
                          value={instruction}
                          onChange={(e) => updateInstruction(index, e.target.value)}
                          placeholder="Enter instruction step..."
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-square"
                          onClick={() => removeInstruction(index)}
                          disabled={exercise.instructions.length === 1}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Delete Modal */}
      <dialog className={`modal ${showDeleteModal ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete Exercise</h3>
          <p className="py-4">Are you sure you want to delete this exercise? This action cannot be undone.</p>
          <div className="modal-action">
            <button className="btn" onClick={() => setShowDeleteModal(false)} disabled={saving}>
              Cancel
            </button>
            <button className="btn btn-error" onClick={handleDelete} disabled={saving}>
              {saving ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setShowDeleteModal(false)}>close</button>
        </form>
      </dialog>
    </div>
  );
} 