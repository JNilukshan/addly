'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase, Ad } from '@/lib/supabaseClient';
import { useAuth } from '@/lib/auth';
import AdForm from '@/components/AdForm';

export default function EditAd() {
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const { data, error } = await supabase
          .from('ads')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            setError('Ad not found or you do not have permission to edit it.');
          } else {
            throw error;
          }
          return;
        }

        setAd(data);
      } catch (error) {
        console.error('Error fetching ad:', error);
        setError('Failed to load ad');
      } finally {
        setLoading(false);
      }
    };

    if (user && id) {
      fetchAd();
    }
  }, [user, id]);

  const handleSubmit = async (formData: {
    title: string;
    description: string;
    destination_url: string;
    status: 'active' | 'inactive';
  }) => {
    if (!user || !ad) {
      throw new Error('User not authenticated or ad not found');
    }

    const { error } = await supabase
      .from('ads')
      .update({
        ...formData,
      })
      .eq('id', id)
      .eq('user_id', user.id); // Ensure user can only update their own ads

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Database error: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-green-400 text-lg">Loading ad...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl">
        <div className="p-6 bg-red-900 border border-red-700 rounded text-red-300">
          <h2 className="text-lg font-semibold mb-2">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 bg-green-600 hover:bg-green-700 text-black px-4 py-2 rounded font-medium transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="max-w-2xl">
        <div className="p-6 bg-gray-900 border border-green-800 rounded text-green-300">
          <h2 className="text-lg font-semibold mb-2">Ad Not Found</h2>
          <p>The ad you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to edit it.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 bg-green-600 hover:bg-green-700 text-black px-4 py-2 rounded font-medium transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-400 mb-2">Edit Ad</h1>
        <p className="text-green-300">
          Update your advertisement details below.
        </p>
      </div>

      <div className="bg-gray-900 p-8 rounded-lg border border-green-800">
        <AdForm 
          initialData={ad} 
          onSubmit={handleSubmit} 
          submitLabel="Update Ad" 
        />
      </div>
    </div>
  );
}