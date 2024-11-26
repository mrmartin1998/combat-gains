'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { JudoClass } from '@/app/types/judo';

export default function JudoClassDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [judoClass, setJudoClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const response = await fetch(`/api/judo-classes/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch class');
        const data = await response.json();
        setJudoClass(data);
      } catch (err) {
        setError('Failed to load class details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClass();
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this class?')) return;

    try {
      const response = await fetch(`/api/judo-classes/${params.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete class');
      router.push('/judo');
    } catch (err) {
      setError('Failed to delete class');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4">
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!judoClass) {
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
            <h1 className="text-2xl font-bold">Class Details</h1>
          </div>
          <div className="flex-none gap-2">
            <Link href={`/judo/${params.id}/edit`} className="btn btn-ghost">
              Edit
            </Link>
            <button onClick={handleDelete} className="btn btn-error">
              Delete
            </button>
            <Link href="/judo" className="btn btn-ghost">
              Back to Classes
            </Link>
          </div>
        </div>

        {/* Class Stats */}
        <div className="stats shadow bg-base-100 w-full">
          <div className="stat">
            <div className="stat-title">Date</div>
            <div className="stat-value text-lg">
              {new Date(judoClass.date).toLocaleDateString()}
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Duration</div>
            <div className="stat-value text-lg">{judoClass.duration} min</div>
          </div>
          <div className="stat">
            <div className="stat-title">Total Activities</div>
            <div className="stat-value text-lg">
              {judoClass.techniques.length + judoClass.partnerWork.length + judoClass.sparringSessions.length}
            </div>
          </div>
        </div>

        {/* Techniques */}
        {judoClass.techniques.length > 0 && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">
                Techniques
                <div className="badge badge-primary">{judoClass.techniques.length}</div>
              </h2>
              <div className="space-y-4">
                {judoClass.techniques.map((technique, index) => (
                  <div key={index} className="collapse collapse-arrow bg-base-200">
                    <input type="checkbox" /> 
                    <div className="collapse-title text-xl font-medium">
                      {technique.name}
                      <div className="badge badge-ghost ml-2">{technique.category}</div>
                    </div>
                    <div className="collapse-content">
                      {technique.notes && <p className="text-sm mt-2">{technique.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Partner Work */}
        {judoClass.partnerWork.length > 0 && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">
                Partner Work
                <div className="badge badge-secondary">{judoClass.partnerWork.length}</div>
              </h2>
              <div className="space-y-4">
                {judoClass.partnerWork.map((work, index) => (
                  <div key={index} className="collapse collapse-arrow bg-base-200">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium">
                      {work.type}
                      <div className="badge badge-ghost ml-2">{work.duration}min</div>
                    </div>
                    <div className="collapse-content">
                      {work.notes && <p className="text-sm mt-2">{work.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sparring Sessions */}
        {judoClass.sparringSessions.length > 0 && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">
                Sparring
                <div className="badge badge-accent">{judoClass.sparringSessions.length}</div>
              </h2>
              <div className="space-y-4">
                {judoClass.sparringSessions.map((session, index) => (
                  <div key={index} className="collapse collapse-arrow bg-base-200">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium">
                      Round {index + 1}
                      <div className="badge badge-ghost ml-2">{session.duration}min</div>
                      <div className="badge badge-ghost ml-2">{session.intensity}</div>
                    </div>
                    <div className="collapse-content">
                      {session.notes && <p className="text-sm mt-2">{session.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        {judoClass.notes && (
          <div className="alert bg-base-100 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-bold">Class Notes</h3>
              <div className="text-sm">{judoClass.notes}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 