'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditJudoClass({ params }) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!classData) return;

    setSaving(true);
    setError('');

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

  // Add the helper functions for techniques, partner work, and sparring sessions
  const addTechnique = () => {
    if (!classData) return;
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
    if (!classData) return;
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
    if (!classData) return;
    setClassData({
      ...classData,
      sparringSessions: [...classData.sparringSessions, {
        duration: 5,
        intensity: 'medium',
        notes: ''
      }]
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Rest of the component JSX remains the same */}
      </div>
    </div>
  );
} 