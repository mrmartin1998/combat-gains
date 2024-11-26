'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { JudoClass, Technique, PartnerWork, SparringSession } from '@/app/types/judo';

export default function LogJudoClass() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [classData, setClassData] = useState<JudoClass>({
    date: new Date().toISOString().split('T')[0],
    duration: 60,
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
        category: 'throws',
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
        type: 'drilling',
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
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Log Judo Class</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Date</span>
          </label>
          <input
            type="date"
            className="input input-bordered"
            value={classData.date}
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
                className="select select-bordered mb-2"
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

        <div className="divider">Partner Work</div>
        
        {classData.partnerWork.map((work, index) => (
          <div key={index} className="card bg-base-200 p-4 mb-4">
            <div className="form-control">
              <input
                type="text"
                placeholder="Partner's name"
                className="input input-bordered mb-2"
                value={work.partnerName}
                onChange={(e) => {
                  const newPartnerWork = [...classData.partnerWork];
                  newPartnerWork[index].partnerName = e.target.value;
                  setClassData({...classData, partnerWork: newPartnerWork});
                }}
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Duration (minutes)"
                  className="input input-bordered"
                  value={work.duration}
                  onChange={(e) => {
                    const newPartnerWork = [...classData.partnerWork];
                    newPartnerWork[index].duration = parseInt(e.target.value);
                    setClassData({...classData, partnerWork: newPartnerWork});
                  }}
                />
                <select
                  className="select select-bordered"
                  value={work.type}
                  onChange={(e) => {
                    const newPartnerWork = [...classData.partnerWork];
                    newPartnerWork[index].type = e.target.value as PartnerWork['type'];
                    setClassData({...classData, partnerWork: newPartnerWork});
                  }}
                >
                  <option value="drilling">Drilling</option>
                  <option value="situational">Situational</option>
                  <option value="sparring">Sparring</option>
                </select>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-secondary w-full mb-6"
          onClick={addPartnerWork}
        >
          Add Partner Work
        </button>

        <div className="divider">Sparring Sessions</div>
        
        {classData.sparringSessions.map((session, index) => (
          <div key={index} className="card bg-base-200 p-4 mb-4">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Duration (minutes)"
                className="input input-bordered"
                value={session.duration}
                onChange={(e) => {
                  const newSessions = [...classData.sparringSessions];
                  newSessions[index].duration = parseInt(e.target.value);
                  setClassData({...classData, sparringSessions: newSessions});
                }}
              />
              <select
                className="select select-bordered"
                value={session.intensity}
                onChange={(e) => {
                  const newSessions = [...classData.sparringSessions];
                  newSessions[index].intensity = e.target.value as SparringSession['intensity'];
                  setClassData({...classData, sparringSessions: newSessions});
                }}
              >
                <option value="light">Light</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-secondary w-full mb-6"
          onClick={addSparringSession}
        >
          Add Sparring Session
        </button>

        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Log Class'}
        </button>
      </form>
    </div>
  );
} 