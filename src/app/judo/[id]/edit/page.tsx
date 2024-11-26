'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { JudoClass, Technique, PartnerWork, SparringSession } from '@/app/types/judo';

export default function EditJudoClass({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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
        category: 'tachi-waza',
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
        type: 'uchikomi',
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen p-4">
        <div className="alert alert-info">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Class not found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="navbar bg-base-100 rounded-box shadow">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Edit Judo Class</h1>
          </div>
          <div className="flex-none">
            <Link href="/judo" className="btn btn-ghost">
              Cancel
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
              <h2 className="card-title">Class Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Date</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    value={classData.date}
                    onChange={(e) => setClassData({...classData, date: e.target.value})}
                  />
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Duration (minutes)</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={classData.duration}
                    onChange={(e) => setClassData({...classData, duration: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="divider">Techniques</div>

          {classData.techniques.map((technique, index) => (
            <div key={index} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-center">
                  <input
                    type="text"
                    placeholder="Technique name"
                    className="input input-bordered w-full max-w-xs"
                    value={technique.name}
                    onChange={(e) => {
                      const newTechniques = [...classData.techniques];
                      newTechniques[index].name = e.target.value;
                      setClassData({...classData, techniques: newTechniques});
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-square btn-ghost"
                    onClick={() => {
                      const newTechniques = classData.techniques.filter((_, idx) => idx !== index);
                      setClassData({...classData, techniques: newTechniques});
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Notes</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-24"
                    value={technique.notes}
                    onChange={(e) => {
                      const newTechniques = [...classData.techniques];
                      newTechniques[index].notes = e.target.value;
                      setClassData({...classData, techniques: newTechniques});
                    }}
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-primary w-full"
            onClick={addTechnique}
          >
            Add Technique
          </button>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Additional Notes</h2>
              <div className="form-control">
                <textarea
                  className="textarea textarea-bordered h-24"
                  value={classData.notes}
                  onChange={(e) => setClassData({...classData, notes: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body flex-row justify-end gap-2">
              <Link href="/judo" className="btn btn-ghost">
                Cancel
              </Link>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? <span className="loading loading-spinner"></span> : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 