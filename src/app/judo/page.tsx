'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { JudoClass } from '@/app/types/judo';

export default function JudoClasses() {
  const [classes, setClasses] = useState<JudoClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('/api/judo-classes');
        if (!response.ok) throw new Error('Failed to fetch classes');
        const data = await response.json();
        setClasses(data);
      } catch (err) {
        setError('Failed to load judo classes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Judo Classes</h1>
        <Link 
          href="/judo/log" 
          className="btn btn-primary"
        >
          Log New Class
        </Link>
      </div>

      {classes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No classes logged yet.</p>
          <Link 
            href="/judo/log" 
            className="btn btn-primary mt-4"
          >
            Log Your First Class
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((judoClass) => (
            <div key={judoClass._id} className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">
                  {new Date(judoClass.date).toLocaleDateString()}
                </h2>
                <p>Duration: {judoClass.duration} minutes</p>
                <p>Techniques: {judoClass.techniques.length}</p>
                <p>Partner Work: {judoClass.partnerWork.length} sessions</p>
                <div className="card-actions justify-end mt-4">
                  <Link 
                    href={`/judo/${judoClass._id}`}
                    className="btn btn-primary btn-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 