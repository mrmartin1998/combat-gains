'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { JudoClass, Technique, PartnerWork, SparringSession } from '@/app/types/judo';

export default function EditJudoClass({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [classData, setClassData] = useState<JudoClass | null>(null);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const response = await fetch(`/api/judo-classes/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch class');
        const data = await response.json();
        setClassData(data);
      } catch (err) {
        setError('Failed to load class details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClass();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classData) return;

    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/judo-classes/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(classData),
      });

      if (!response.ok) throw new Error('Failed to update class');
      
      router.push(`/judo/${params.id}`);
    } catch (err) {
      setError('Failed to update class. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Handler functions for adding/removing items
  const addTechnique = () => {
    if (!classData) return;
    setClassData({
      ...classData,
      techniques: [...classData.techniques, {
        name: '',
        category: 'throws',
        notes: '',
      }],
    });
  };

  const removeTechnique = (index: number) => {
    if (!classData) return;
    const newTechniques = [...classData.techniques];
    newTechniques.splice(index, 1);
    setClassData({ ...classData, techniques: newTechniques });
  };

  const addPartnerWork = () => {
    if (!classData) return;
    setClassData({
      ...classData,
      partnerWork: [...classData.partnerWork, {
        partnerName: '',
        duration: 15,
        type: 'drilling',
        notes: '',
      }],
    });
  };

  const removePartnerWork = (index: number) => {
    if (!classData) return;
    const newPartnerWork = [...classData.partnerWork];
    newPartnerWork.splice(index, 1);
    setClassData({ ...classData, partnerWork: newPartnerWork });
  };

  const addSparringSession = () => {
    if (!classData) return;
    setClassData({
      ...classData,
      sparringSessions: [...classData.sparringSessions, {
        duration: 5,
        intensity: 'medium',
        notes: '',
      }],
    });
  };

  const removeSparringSession = (index: number) => {
    if (!classData) return;
    const newSessions = [...classData.sparringSessions];
    newSessions.splice(index, 1);
    setClassData({ ...classData, sparringSessions: newSessions });
  };

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!classData) return <div className="alert alert-error">Class not found</div>;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Judo Class</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Date</span>
          </label>
          <input
            type="date"
            className="input input-bordered"
            value={classData.date.split('T')[0]}
            onChange={(e) => setClassData({...classData, date: e.target.value})}
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Duration (minutes)</span>
          </label>
          <input
            type="number"
            className="input input-bordered"
            value={classData.duration}
            onChange={(e) => setClassData({...classData, duration: parseInt(e.target.value)})}
            required
          />
        </div>

        <div className="divider">Techniques</div>
        
        {classData.techniques.map((technique, index) => (
          <div key={index} className="card bg-base-200 p-4 mb-4">
            <div className="flex justify-end mb-2">
              <button
                type="button"
                className="btn btn-error btn-sm"
                onClick={() => removeTechnique(index)}
              >
                Remove
              </button>
            </div>
            <div className="form-control">
              <input
                type="text"
                placeholder="Technique name"
                className="input input-bordered mb-2"
                value={technique.name}
                onChange={(e) => {
                  const newTechniques = [...classData.techniques];
                  newTechniques[index].name = e.target.value;
                  setClassData({...classData, techniques: newTechniques});
                }}
                required
              />
              <select
                className="select select-bordered"
                value={technique.category}
                onChange={(e) => {
                  const newTechniques = [...classData.techniques];
                  newTechniques[index].category = e.target.value as Technique['category'];
                  setClassData({...classData, techniques: newTechniques});
                }}
              >
                <option value="throws">Throws</option>
                <option value="pins">Pins</option>
                <option value="submissions">Submissions</option>
                <option value="combinations">Combinations</option>
                <option value="drills">Drills</option>
              </select>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-secondary w-full"
          onClick={addTechnique}
        >
          Add Technique
        </button>

        {/* Similar sections for Partner Work and Sparring Sessions */}
        {/* ... (implementation similar to the log page) ... */}

        <div className="form-control">
          <label className="label">
            <span className="label-text">Notes</span>
          </label>
          <textarea
            className="textarea textarea-bordered h-24"
            value={classData.notes}
            onChange={(e) => setClassData({...classData, notes: e.target.value})}
          />
        </div>

        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            className="btn btn-ghost flex-1"
            onClick={() => router.back()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary flex-1"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
} 