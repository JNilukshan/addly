'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, Ad } from '@/lib/supabaseClient';
import { useAuth } from '@/lib/auth';

export default function Dashboard() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchAds();
    }
  }, [user]);

  const fetchAds = async () => {
    try {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAds(data || []);
    } catch (error) {
      setError('Failed to fetch ads');
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ad?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('ads')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setAds(ads.filter(ad => ad.id !== id));
    } catch (error) {
      console.error('Error deleting ad:', error);
      setError('Failed to delete ad');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-green-400 text-lg">Loading your ads...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-400">My Ads</h1>
        <button
          onClick={() => router.push('/dashboard/create')}
          className="bg-green-600 hover:bg-green-700 text-black px-6 py-2 rounded font-medium transition-colors"
        >
          Create New Ad
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded text-red-300">
          {error}
        </div>
      )}

      {ads.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-green-300 text-lg mb-4">No ads yet</div>
          <p className="text-green-500 mb-6">Create your first ad to get started</p>
          <button
            onClick={() => router.push('/dashboard/create')}
            className="bg-green-600 hover:bg-green-700 text-black px-6 py-2 rounded font-medium transition-colors"
          >
            Create Your First Ad
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ads.map((ad) => (
            <div key={ad.id} className="bg-gray-900 border border-green-800 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-green-400 truncate">
                  {ad.title}
                </h3>
                <span className={`px-2 py-1 text-xs rounded ${
                  ad.status === 'active' 
                    ? 'bg-green-900 text-green-300 border border-green-700' 
                    : 'bg-gray-800 text-gray-400 border border-gray-600'
                }`}>
                  {ad.status}
                </span>
              </div>
              
              <p className="text-green-300 text-sm mb-4 line-clamp-3">
                {ad.description}
              </p>
              
              <p className="text-green-500 text-xs mb-4 truncate">
                {ad.destination_url}
              </p>
              
              <div className="flex justify-between items-center">
                <span className="text-green-600 text-xs">
                  {new Date(ad.created_at).toLocaleDateString()}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => router.push(`/dashboard/edit/${ad.id}`)}
                    className="text-green-400 hover:text-green-300 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(ad.id)}
                    className="text-red-400 hover:text-red-300 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}