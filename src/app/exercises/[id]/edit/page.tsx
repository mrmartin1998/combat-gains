'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Trash2 } from 'lucide-react';

interface ExerciseForm {
  name: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string;
  type: string;
  isPublic: boolean;
  description: string;
  instructions: string[];
}

export default function EditExercise({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [exercise, setExercise] = useState<ExerciseForm>({
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
    fetchExercise();
  }, [params.id]);

  const fetchExercise = async () => {
    try {
      const res = await fetch(`/api/exercises/${params.id}`);
      if (!res.ok) throw new Error('Failed to fetch exercise');
      const data = await res.json();
      setExercise(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addInstruction = () => {
    setExercise(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/exercises/${params.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete exercise');
      router.push('/exercises');
    } catch (err: any) {
      setError(err.message);
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
              className="btn btn-ghost btn-sm text-error"
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
                  <span className="label-text">Equipment</span>
                </label>
                <select
                  className="select select-bordered"
                  value={exercise.equipment}
                  onChange={(e) => setExercise({...exercise, equipment: e.target.value})}
                >
                  <option value="barbell">Barbell</option>
                  <option value="dumbbell">Dumbbell</option>
                  <option value="kettlebell">Kettlebell</option>
                  <option value="bodyweight">Bodyweight</option>
                  <option value="machine">Machine</option>
                  <option value="cable">Cable</option>
                  <option value="band">Band</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Type</span>
                </label>
                <select
                  className="select select-bordered"
                  value={exercise.type}
                  onChange={(e) => setExercise({...exercise, type: e.target.value})}
                >
                  <option value="strength">Strength</option>
                  <option value="cardio">Cardio</option>
                  <option value="flexibility">Flexibility</option>
                  <option value="balance">Balance</option>
                  <option value="plyometric">Plyometric</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Muscles Worked</h2>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Primary Muscles</span>
                </label>
                <select
                  multiple
                  className="select select-bordered min-h-[200px]"
                  value={exercise.primaryMuscles}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    setExercise({...exercise, primaryMuscles: values});
                  }}
                >
                  <option value="chest">Chest</option>
                  <option value="back">Back</option>
                  <option value="shoulders">Shoulders</option>
                  <option value="biceps">Biceps</option>
                  <option value="triceps">Triceps</option>
                  <option value="legs">Legs</option>
                  <option value="core">Core</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Secondary Muscles</span>
                </label>
                <select
                  multiple
                  className="select select-bordered min-h-[200px]"
                  value={exercise.secondaryMuscles}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    setExercise({...exercise, secondaryMuscles: values});
                  }}
                >
                  <option value="chest">Chest</option>
                  <option value="back">Back</option>
                  <option value="shoulders">Shoulders</option>
                  <option value="biceps">Biceps</option>
                  <option value="triceps">Triceps</option>
                  <option value="legs">Legs</option>
                  <option value="core">Core</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Description & Instructions</h2>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24"
                  value={exercise.description}
                  onChange={(e) => setExercise({...exercise, description: e.target.value})}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Instructions</span>
                </label>
                {exercise.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="input input-bordered flex-1"
                      value={instruction}
                      onChange={(e) => {
                        const newInstructions = [...exercise.instructions];
                        newInstructions[index] = e.target.value;
                        setExercise({...exercise, instructions: newInstructions});
                      }}
                      placeholder={`Step ${index + 1}`}
                    />
                    {index === exercise.instructions.length - 1 && (
                      <button
                        type="button"
                        onClick={addInstruction}
                        className="btn btn-square btn-outline"
                      >
                        +
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Settings</h2>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Make this exercise public</span>
                  <input
                    type="checkbox"
                    className="toggle"
                    checked={exercise.isPublic}
                    onChange={(e) => setExercise({...exercise, isPublic: e.target.checked})}
                  />
                </label>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      <dialog className={`modal ${showDeleteModal ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete Exercise</h3>
          <p className="py-4">Are you sure you want to delete this exercise? This action cannot be undone.</p>
          <div className="modal-action">
            <button className="btn" onClick={() => setShowDeleteModal(false)}>Cancel</button>
            <button className="btn btn-error" onClick={handleDelete}>Delete</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setShowDeleteModal(false)}>close</button>
        </form>
      </dialog>
    </div>
  );
} 