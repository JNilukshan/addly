'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';

function SignInContent() {
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-950 flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-gray-900/80 backdrop-blur-md border border-green-800 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Left Panel */}
        <div className="hidden md:flex flex-col justify-between p-8 bg-gradient-to-b from-green-800/30 to-transparent border-r border-green-800 w-1/2">
          <div>
            <h1 className="text-5xl font-extrabold text-green-400 mb-3">Adly</h1>
            <p className="text-green-200 text-lg">
              Your smart platform for managing and analyzing digital ads.
            </p>
          </div>
          <div className="flex justify-center mt-12">
            <img
              src="/illustrations/undraw_distractions_jmxk.svg"
              alt="Ad management illustration"
              className="w-72 opacity-80 animate-float"
            />
          </div>
          <div className="text-green-500 text-sm mt-8">
            © {new Date().getFullYear()} Adly Inc. All rights reserved.
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
          {errorParam && (
            <div className="mb-6 p-3 bg-red-900 border border-red-700 rounded text-red-300 text-sm">
              {errorParam}
            </div>
          )}
          {error && (
            <div className="mb-6 p-3 bg-red-900 border border-red-700 rounded text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-green-400 mb-1">Welcome Back</h2>
            <p className="text-green-300 text-sm">Sign in to manage your ads</p>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-black font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            {loading ? 'Redirecting...' : 'Continue with Google'}
          </button>

          <p className="text-center text-green-400 text-sm mt-6">
            Sign in securely with your Google account
          </p>

          <div className="mt-8 flex items-center justify-center">
            <div className="h-px bg-green-800 flex-1"></div>
            <span className="text-green-700 text-xs px-2">or</span>
            <div className="h-px bg-green-800 flex-1"></div>
          </div>

          <p className="text-center text-green-600 text-xs mt-6">
            By signing in, you agree to our{' '}
            <a href="#" className="underline hover:text-green-400">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="underline hover:text-green-400">Privacy Policy</a>.
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={<div className="text-green-400 p-8 text-center">Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}
