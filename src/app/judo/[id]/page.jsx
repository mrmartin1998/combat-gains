'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Edit, Trash2 } from 'lucide-react';

export default function JudoClassDetail({ params }) {
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

  if (!judoClass) return null;

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Link href="/judo" className="btn btn-ghost btn-sm">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div className="flex gap-2">
            <Link href={`/judo/${params.id}/edit`} className="btn btn-ghost btn-sm">
              <Edit className="h-4 w-4" />
              Edit
            </Link>
            <button onClick={handleDelete} className="btn btn-error btn-sm">
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Class Info */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <h2 className="card-title">
                {new Date(judoClass.date).toLocaleDateString()}
              </h2>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="badge badge-secondary">{judoClass.duration}min</span>
              </div>
            </div>
            <div className="badge badge-outline">{judoClass.type}</div>
          </div>
        </div>

        {/* Techniques */}
        {judoClass.techniques.length > 0 && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Techniques</h3>
              <div className="space-y-4">
                {judoClass.techniques.map((technique, index) => (
                  <div key={index} className="border-l-4 border-primary pl-4">
                    <h4 className="font-bold">{technique.name}</h4>
                    <div className="badge badge-outline">{technique.category}</div>
                    {technique.notes && <p className="mt-2 text-sm opacity-70">{technique.notes}</p>}
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
              <h3 className="card-title">Partner Work</h3>
              <div className="space-y-4">
                {judoClass.partnerWork.map((work, index) => (
                  <div key={index} className="border-l-4 border-secondary pl-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold">{work.partnerName}</h4>
                      <span className="badge badge-secondary">{work.duration}min</span>
                    </div>
                    <div className="badge badge-outline">{work.type}</div>
                    {work.notes && <p className="mt-2 text-sm opacity-70">{work.notes}</p>}
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
              <h3 className="card-title">Sparring</h3>
              <div className="space-y-4">
                {judoClass.sparringSessions.map((session, index) => (
                  <div key={index} className="border-l-4 border-accent pl-4">
                    <div className="flex justify-between items-center">
                      <div className="badge badge-outline">{session.intensity} intensity</div>
                      <span className="badge badge-secondary">{session.duration}min</span>
                    </div>
                    {session.notes && <p className="mt-2 text-sm opacity-70">{session.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        {judoClass.notes && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Notes</h3>
              <p className="whitespace-pre-wrap">{judoClass.notes}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
} 