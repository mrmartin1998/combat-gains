'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { JudoClass } from '@/app/types/judo';

export default function JudoClassDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [judoClass, setJudoClass] = useState<JudoClass | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!judoClass) return <div className="alert alert-error">Class not found</div>;

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Class on {new Date(judoClass.date).toLocaleDateString()}
        </h1>
        <div className="flex gap-2">
          <Link
            href={`/judo/${params.id}/edit`}
            className="btn btn-primary"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="btn btn-error"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="card bg-base-200 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title">Details</h2>
          <p>Duration: {judoClass.duration} minutes</p>
          {judoClass.notes && <p>Notes: {judoClass.notes}</p>}
        </div>
      </div>

      {judoClass.techniques.length > 0 && (
        <div className="card bg-base-200 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title">Techniques</h2>
            <ul className="list-disc list-inside">
              {judoClass.techniques.map((technique, index) => (
                <li key={index}>
                  {technique.name} ({technique.category})
                  {technique.notes && <p className="ml-6 text-sm">{technique.notes}</p>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {judoClass.partnerWork.length > 0 && (
        <div className="card bg-base-200 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title">Partner Work</h2>
            <ul className="list-disc list-inside">
              {judoClass.partnerWork.map((work, index) => (
                <li key={index}>
                  {work.duration} minutes {work.type} with {work.partnerName}
                  {work.notes && <p className="ml-6 text-sm">{work.notes}</p>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {judoClass.sparringSessions.length > 0 && (
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Sparring Sessions</h2>
            <ul className="list-disc list-inside">
              {judoClass.sparringSessions.map((session, index) => (
                <li key={index}>
                  {session.duration} minutes at {session.intensity} intensity
                  {session.notes && <p className="ml-6 text-sm">{session.notes}</p>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
} 