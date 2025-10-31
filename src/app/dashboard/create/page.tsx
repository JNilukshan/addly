'use client';

import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/lib/auth';
import AdForm from '@/components/AdForm';

export default function CreateAd() {
  const { user } = useAuth();

  const handleSubmit = async (formData: {
    title: string;
    description: string;
    destination_url: string;
    status: 'active' | 'inactive';
  }) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('ads')
      .insert([
        {
          ...formData,
          user_id: user.id,
        },
      ]);

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Database error: ${error.message}`);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-400 mb-2">Create New Ad</h1>
        <p className="text-green-300">
          Fill out the form below to create a new advertisement.
        </p>
      </div>

      <div className="bg-gray-900 p-8 rounded-lg border border-green-800">
        <AdForm onSubmit={handleSubmit} submitLabel="Create Ad" />
      </div>
    </div>
  );
}