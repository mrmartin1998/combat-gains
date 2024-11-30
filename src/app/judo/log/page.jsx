'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';

export default function LogJudoClass() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [classData, setClassData] = useState({
    date: new Date().toISOString().split('T')[0],
    duration: 60,
    type: 'regular',
    techniques: [],
    partnerWork: [],
    sparringSessions: [],
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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

  // Helper functions for adding items
  const addTechnique = () => {
    setClassData({
      ...classData,
      techniques: [...classData.techniques, {
        name: '',
        category: 'tachi-waza',
        notes: ''
      }]
    });
  };

  const addPartnerWork = () => {
    setClassData({
      ...classData,
      partnerWork: [...classData.partnerWork, {
        partnerName: '',
        duration: 15,
        type: 'uchikomi',
        notes: ''
      }]
    });
  };

  const addSparringSession = () => {
    setClassData({
      ...classData,
      sparringSessions: [...classData.sparringSessions, {
        duration: 5,
        intensity: 'medium',
        notes: ''
      }]
    });
  };

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Link href="/judo" className="btn btn-ghost btn-sm">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Class Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Date</span>
                  </label>
                  <input
                    type="date"
                    value={classData.date}
                    onChange={(e) => setClassData({ ...classData, date: e.target.value })}
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Duration (minutes)</span>
                  </label>
                  <input
                    type="number"
                    value={classData.duration}
                    onChange={(e) => setClassData({ ...classData, duration: parseInt(e.target.value) })}
                    className="input input-bordered"
                    min="1"
                    required
                  />
                </div>
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Type</span>
                  </label>
                  <select
                    value={classData.type}
                    onChange={(e) => setClassData({ ...classData, type: e.target.value })}
                    className="select select-bordered"
                    required
                  >
                    <option value="regular">Regular Class</option>
                    <option value="private">Private Lesson</option>
                    <option value="competition">Competition Training</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Techniques Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <h2 className="card-title">Techniques</h2>
                <button type="button" onClick={addTechnique} className="btn btn-ghost btn-sm">
                  <Plus className="h-4 w-4" />
                  Add Technique
                </button>
              </div>
              <div className="space-y-4">
                {classData.techniques.map((technique, index) => (
                  <div key={index} className="card bg-base-200">
                    <div className="card-body">
                      <div className="grid gap-4">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Name</span>
                          </label>
                          <input
                            type="text"
                            value={technique.name}
                            onChange={(e) => {
                              const newTechniques = [...classData.techniques];
                              newTechniques[index].name = e.target.value;
                              setClassData({ ...classData, techniques: newTechniques });
                            }}
                            className="input input-bordered"
                            required
                          />
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Category</span>
                          </label>
                          <select
                            value={technique.category}
                            onChange={(e) => {
                              const newTechniques = [...classData.techniques];
                              newTechniques[index].category = e.target.value;
                              setClassData({ ...classData, techniques: newTechniques });
                            }}
                            className="select select-bordered"
                            required
                          >
                            <option value="tachi-waza">Tachi-waza</option>
                            <option value="ne-waza">Ne-waza</option>
                            <option value="ukemi">Ukemi</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Notes</span>
                          </label>
                          <textarea
                            value={technique.notes}
                            onChange={(e) => {
                              const newTechniques = [...classData.techniques];
                              newTechniques[index].notes = e.target.value;
                              setClassData({ ...classData, techniques: newTechniques });
                            }}
                            className="textarea textarea-bordered"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Partner Work Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <h2 className="card-title">Partner Work</h2>
                <button type="button" onClick={addPartnerWork} className="btn btn-ghost btn-sm">
                  <Plus className="h-4 w-4" />
                  Add Partner Work
                </button>
              </div>
              <div className="space-y-4">
                {classData.partnerWork.map((work, index) => (
                  <div key={index} className="card bg-base-200">
                    <div className="card-body">
                      <div className="grid gap-4">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Partner Name</span>
                          </label>
                          <input
                            type="text"
                            value={work.partnerName}
                            onChange={(e) => {
                              const newWork = [...classData.partnerWork];
                              newWork[index].partnerName = e.target.value;
                              setClassData({ ...classData, partnerWork: newWork });
                            }}
                            className="input input-bordered"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text">Duration (minutes)</span>
                            </label>
                            <input
                              type="number"
                              value={work.duration}
                              onChange={(e) => {
                                const newWork = [...classData.partnerWork];
                                newWork[index].duration = parseInt(e.target.value);
                                setClassData({ ...classData, partnerWork: newWork });
                              }}
                              className="input input-bordered"
                              min="1"
                              required
                            />
                          </div>
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text">Type</span>
                            </label>
                            <select
                              value={work.type}
                              onChange={(e) => {
                                const newWork = [...classData.partnerWork];
                                newWork[index].type = e.target.value;
                                setClassData({ ...classData, partnerWork: newWork });
                              }}
                              className="select select-bordered"
                              required
                            >
                              <option value="uchikomi">Uchikomi</option>
                              <option value="nagekomi">Nagekomi</option>
                              <option value="drill">Drill</option>
                              <option value="situation">Situation</option>
                            </select>
                          </div>
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Notes</span>
                          </label>
                          <textarea
                            value={work.notes}
                            onChange={(e) => {
                              const newWork = [...classData.partnerWork];
                              newWork[index].notes = e.target.value;
                              setClassData({ ...classData, partnerWork: newWork });
                            }}
                            className="textarea textarea-bordered"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sparring Sessions Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <h2 className="card-title">Sparring</h2>
                <button type="button" onClick={addSparringSession} className="btn btn-ghost btn-sm">
                  <Plus className="h-4 w-4" />
                  Add Sparring
                </button>
              </div>
              <div className="space-y-4">
                {classData.sparringSessions.map((session, index) => (
                  <div key={index} className="card bg-base-200">
                    <div className="card-body">
                      <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text">Duration (minutes)</span>
                            </label>
                            <input
                              type="number"
                              value={session.duration}
                              onChange={(e) => {
                                const newSessions = [...classData.sparringSessions];
                                newSessions[index].duration = parseInt(e.target.value);
                                setClassData({ ...classData, sparringSessions: newSessions });
                              }}
                              className="input input-bordered"
                              min="1"
                              required
                            />
                          </div>
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text">Intensity</span>
                            </label>
                            <select
                              value={session.intensity}
                              onChange={(e) => {
                                const newSessions = [...classData.sparringSessions];
                                newSessions[index].intensity = e.target.value;
                                setClassData({ ...classData, sparringSessions: newSessions });
                              }}
                              className="select select-bordered"
                              required
                            >
                              <option value="light">Light</option>
                              <option value="medium">Medium</option>
                              <option value="hard">Hard</option>
                            </select>
                          </div>
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Notes</span>
                          </label>
                          <textarea
                            value={session.notes}
                            onChange={(e) => {
                              const newSessions = [...classData.sparringSessions];
                              newSessions[index].notes = e.target.value;
                              setClassData({ ...classData, sparringSessions: newSessions });
                            }}
                            className="textarea textarea-bordered"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notes Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Notes</h2>
              <div className="form-control">
                <textarea
                  value={classData.notes}
                  onChange={(e) => setClassData({ ...classData, notes: e.target.value })}
                  className="textarea textarea-bordered"
                  placeholder="Any general notes about the class..."
                  rows={4}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Link href="/judo" className="btn btn-ghost">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="loading loading-spinner"></span> : 'Save Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 