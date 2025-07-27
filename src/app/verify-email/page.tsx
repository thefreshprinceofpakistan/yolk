'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

function VerifyEmailContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully!');
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred during verification');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#ff9e03] flex items-center justify-center">
      <div className="bg-egg-white/90 backdrop-blur-sm rounded-none p-8 shadow-pixel border-3 border-egg-yolk text-center max-w-md w-full mx-4">
        <div className="flex justify-center mb-6">
          {status === 'loading' && (
            <div className="animate-bounce">
              <Image
                src="/pixil-frame-0 (9).png"
                alt="Verifying"
                width={80}
                height={80}
                className="w-20 h-20 object-contain"
              />
            </div>
          )}
          {status === 'success' && (
            <div className="text-6xl mb-4">✅</div>
          )}
          {status === 'error' && (
            <div className="text-6xl mb-4">❌</div>
          )}
        </div>

        <h2 className="text-2xl font-pixel font-bold text-egg-pixel-black mb-4">
          {status === 'loading' && 'VERIFYING EMAIL...'}
          {status === 'success' && 'EMAIL VERIFIED!'}
          {status === 'error' && 'VERIFICATION FAILED'}
        </h2>

        <p className="font-fun text-egg-pixel-black mb-6">
          {status === 'loading' && 'Please wait while we verify your email address...'}
          {status === 'success' && message}
          {status === 'error' && message}
        </p>

        {status === 'success' && (
          <Link
            href="/login"
            className="bg-egg-yolk hover:bg-egg-yolkDark text-egg-pixel-black font-pixel font-semibold px-6 py-3 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200 hover:shadow-pixel-lg inline-block"
          >
            SIGN IN NOW
          </Link>
        )}

        {status === 'error' && (
          <div className="space-y-3">
            <p className="font-fun text-egg-pixel-black text-sm">
              The verification link may have expired or is invalid. Please try signing in again to receive a new verification email.
            </p>
            <Link
              href="/login"
              className="bg-egg-yolk hover:bg-egg-yolkDark text-egg-pixel-black font-pixel font-semibold px-6 py-3 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200 hover:shadow-pixel-lg inline-block"
            >
              GO TO SIGN IN
            </Link>
          </div>
        )}

        <div className="mt-6">
          <Link
            href="/"
            className="text-egg-yolkDark hover:text-egg-pixel-black font-fun text-sm transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#ff9e03] flex items-center justify-center">
        <div className="bg-egg-white/90 backdrop-blur-sm rounded-none p-8 shadow-pixel border-3 border-egg-yolk text-center max-w-md w-full mx-4">
          <div className="animate-bounce">
            <Image
              src="/pixil-frame-0 (9).png"
              alt="Loading"
              width={80}
              height={80}
              className="w-20 h-20 object-contain mx-auto"
            />
          </div>
          <h2 className="text-2xl font-pixel font-bold text-egg-pixel-black mb-4">
            LOADING...
          </h2>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
} 