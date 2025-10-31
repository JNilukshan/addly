'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signInWithGoogle } = useAuth();
  const searchParams = useSearchParams();

  const errorParam = searchParams.get('error');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    
    const { error } = await signInWithGoogle();
    
    if (error) {
      setError(error.message);
      setLoading(false);
    }
    // Note: Google sign-in will redirect, so we don't set loading to false here
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        

        <div className="bg-gray-900 p-8 rounded-lg border border-green-800">
          {errorParam && (
            <div className="mb-6 p-3 bg-red-900 border border-red-700 rounded text-red-300">
              {errorParam}
            </div>
          )}

          {error && (
            <div className="mb-6 p-3 bg-red-900 border border-red-700 rounded text-red-300">
              {error}
            </div>
          )}
          <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-400 mb-2">Adly</h1>
          <p className="text-green-300">Sign in to manage your ads</p>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-black font-medium py-3 px-4 rounded transition-colors"
          >
            {loading ? 'Redirecting...' : 'Continue with Google'}
          </button>

          <p className="text-center text-green-500 text-sm mt-4">
            Sign in with your Google account to get started
          </p>
        </div>
      </div>
    </div>
  );
}