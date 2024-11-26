'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { JudoClass, Technique, PartnerWork, SparringSession } from '@/app/types/judo';

export default function LogJudoClass() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [classData, setClassData] = useState<JudoClass>({
    date: new Date().toISOString().split('T')[0],
    duration: 60,
    type: 'regular',
    techniques: [],
    partnerWork: [],
    sparringSessions: [],
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/judo-classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(classData),
      });

      if (!response.ok) throw new Error('Failed to log class');
      
      router.push('/judo');
    } catch (err) {
      setError('Failed to log class. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTechnique = () => {
    setClassData({
      ...classData,
      techniques: [...classData.techniques, {
        name: '',
        category: 'tachi-waza',
        notes: '',
      }],
    });
  };

  const addPartnerWork = () => {
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

  const addSparringSession = () => {
    setClassData({
      ...classData,
      sparringSessions: [...classData.sparringSessions, {
        duration: 5,
        intensity: 'medium',
        notes: '',
      }],
    });
  };

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="navbar bg-base-100 rounded-box shadow">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Log New Class</h1>
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

          {/* Basic Details */}
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
                    required
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
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Techniques */}
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
                  <select
                    className="select select-bordered"
                    value={technique.category}
                    onChange={(e) => {
                      const newTechniques = [...classData.techniques];
                      newTechniques[index].category = e.target.value as 'tachi-waza' | 'ne-waza' | 'ukemi' | 'other';
                      setClassData({...classData, techniques: newTechniques});
                    }}
                  >
                    <option value="tachi-waza">Tachi-waza</option>
                    <option value="ne-waza">Ne-waza</option>
                    <option value="ukemi">Ukemi</option>
                    <option value="other">Other</option>
                  </select>
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

                <div className="form-control mt-4">
                  <textarea
                    placeholder="Notes about this technique..."
                    className="textarea textarea-bordered h-16"
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

          {/* Partner Work */}
          <div className="divider">Partner Work</div>
          
          {classData.partnerWork.map((work, index) => (
            <div key={index} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-center">
                  <select
                    className="select select-bordered w-full max-w-xs"
                    value={work.type}
                    onChange={(e) => {
                      const newPartnerWork = [...classData.partnerWork];
                      newPartnerWork[index].type = e.target.value as 'uchikomi' | 'nagekomi' | 'drill' | 'situation';
                      setClassData({...classData, partnerWork: newPartnerWork});
                    }}
                  >
                    <option value="uchikomi">Uchikomi</option>
                    <option value="nagekomi">Nagekomi</option>
                    <option value="drill">Technical Drill</option>
                    <option value="situation">Situational Practice</option>
                  </select>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Duration"
                      className="input input-bordered w-24"
                      value={work.duration}
                      onChange={(e) => {
                        const newPartnerWork = [...classData.partnerWork];
                        newPartnerWork[index].duration = parseInt(e.target.value);
                        setClassData({...classData, partnerWork: newPartnerWork});
                      }}
                    />
                    <span className="text-sm opacity-70">min</span>
                  </div>

                  <button
                    type="button"
                    className="btn btn-square btn-ghost"
                    onClick={() => {
                      const newPartnerWork = classData.partnerWork.filter((_, idx) => idx !== index);
                      setClassData({...classData, partnerWork: newPartnerWork});
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="form-control mt-4">
                  <textarea
                    placeholder="Notes about this practice..."
                    className="textarea textarea-bordered h-16"
                    value={work.notes}
                    onChange={(e) => {
                      const newPartnerWork = [...classData.partnerWork];
                      newPartnerWork[index].notes = e.target.value;
                      setClassData({...classData, partnerWork: newPartnerWork});
                    }}
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-primary w-full"
            onClick={addPartnerWork}
          >
            Add Partner Work
          </button>

          {/* Sparring */}
          <div className="divider">Sparring</div>
          
          {classData.sparringSessions.map((session, index) => (
            <div key={index} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Duration</span>
                      </label>
                      <input
                        type="number"
                        className="input input-bordered w-24"
                        value={session.duration}
                        onChange={(e) => {
                          const newSessions = [...classData.sparringSessions];
                          newSessions[index].duration = parseInt(e.target.value);
                          setClassData({...classData, sparringSessions: newSessions});
                        }}
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Intensity</span>
                      </label>
                      <select
                        className="select select-bordered"
                        value={session.intensity}
                        onChange={(e) => {
                          const newSessions = [...classData.sparringSessions];
                          newSessions[index].intensity = e.target.value as 'light' | 'medium' | 'hard';
                          setClassData({...classData, sparringSessions: newSessions});
                        }}
                      >
                        <option value="light">Light</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-square btn-ghost"
                    onClick={() => {
                      const newSessions = classData.sparringSessions.filter((_, idx) => idx !== index);
                      setClassData({...classData, sparringSessions: newSessions});
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="form-control mt-4">
                  <textarea
                    placeholder="Notes about this sparring session..."
                    className="textarea textarea-bordered h-16"
                    value={session.notes}
                    onChange={(e) => {
                      const newSessions = [...classData.sparringSessions];
                      newSessions[index].notes = e.target.value;
                      setClassData({...classData, sparringSessions: newSessions});
                    }}
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-primary w-full"
            onClick={addSparringSession}
          >
            Add Sparring Session
          </button>

          {/* Notes */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Additional Notes</h2>
              <div className="form-control">
                <textarea
                  className="textarea textarea-bordered h-24"
                  placeholder="Any general notes about the class..."
                  value={classData.notes}
                  onChange={(e) => setClassData({...classData, notes: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body flex-row justify-end gap-2">
              <Link href="/judo" className="btn btn-ghost">
                Cancel
              </Link>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <span className="loading loading-spinner"></span> : 'Save Class'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 