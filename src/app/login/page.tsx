'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Character {
  animal: 'cow' | 'pig' | 'chick';
  accessory: 'none' | 'bow' | 'moustache' | 'hat';
  name: string;
}

export default function Login() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          action: 'login'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user session (in a real app, you'd verify credentials with a server)
        const userSession: {
          id: string;
          name: string;
          email?: string;
          isLoggedIn: boolean;
          loginTime: string;
          emailVerified?: boolean;
          character?: Character; // Added character property
        } = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          isLoggedIn: true,
          loginTime: new Date().toISOString(),
          emailVerified: data.user.emailVerified,
        };

        // Check if user has a character
        const existingCharacter = localStorage.getItem('userCharacter');
        
        if (existingCharacter) {
          // Load existing character data
          try {
            const character = JSON.parse(existingCharacter);
            userSession.character = character;
          } catch (error) {
            console.error('Error loading character:', error);
          }
        }

        localStorage.setItem('userSession', JSON.stringify(userSession));
        
        setIsSubmitting(false);
        
        if (!existingCharacter) {
          // First time user - redirect to character creation
          window.location.href = '/character-creation';
        } else {
          // Returning user - redirect to homepage
          window.location.href = '/';
        }
      } else {
        setError(data.error || 'Login failed');
        setIsSubmitting(false);
      }
    } catch (error) {
      setError('Network error. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ff9e03] flex items-center justify-center p-4">
      <div className="bg-egg-white/90 backdrop-blur-sm rounded-none p-8 shadow-pixel border-3 border-egg-yolk text-center max-w-md w-full">
        {/* Animated Egg GIF */}
        <div className="flex justify-center mb-6">
          <div className="animate-wobble">
            <Image
              src="/egg.gif"
              alt="Animated egg"
              width={120}
              height={120}
              className="w-30 h-30 object-contain"
              unoptimized
            />
          </div>
        </div>

        <h1 className="text-3xl font-pixel font-bold text-egg-pixel-black mb-2">
          WELCOME TO THE EGGCONOMY
        </h1>
        <p className="font-fun text-egg-pixel-black mb-8">
          Sign in to manage your listings and trades
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-pixel font-semibold text-egg-pixel-black mb-2 text-left">
              NAME *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              minLength={2}
              maxLength={50}
              className="w-full px-4 py-3 border-3 border-egg-pixel-black rounded-none bg-egg-white font-fun shadow-pixel focus:outline-none focus:ring-2 focus:ring-egg-yolk"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-pixel font-semibold text-egg-pixel-black mb-2 text-left">
              EMAIL (OPTIONAL)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-3 border-egg-pixel-black rounded-none bg-egg-white font-fun shadow-pixel focus:outline-none focus:ring-2 focus:ring-egg-yolk"
              placeholder="your@email.com"
            />
            <p className="text-xs font-fun text-egg-yolkDark mt-1 text-left">
              Adding an email helps with account recovery and verification
            </p>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-pixel font-semibold text-egg-pixel-black mb-2 text-left">
              PASSWORD *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={6}
                className="w-full px-4 py-3 pr-12 border-3 border-egg-pixel-black rounded-none bg-egg-white font-fun shadow-pixel focus:outline-none focus:ring-2 focus:ring-egg-yolk"
                placeholder="At least 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-egg-pixel-black hover:text-egg-yolkDark"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 rounded-none font-fun">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-none font-pixel font-semibold border-2 border-egg-pixel-black shadow-pixel transition-all duration-200 ${
              isSubmitting
                ? 'bg-egg-pixel-gray text-egg-pixel-black cursor-not-allowed'
                : 'bg-egg-yolk hover:bg-egg-yolkDark text-egg-pixel-black hover:shadow-pixel-lg'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-wiggle">
                  <Image
                    src="/pixil-frame-0 (9).png"
                    alt="Loading"
                    width={24}
                    height={24}
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <span>SIGNING IN...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span>SIGN IN</span>
                <Image
                  src="/pixil-frame-0 (9).png"
                  alt="Sign in"
                  width={20}
                  height={20}
                  className="w-5 h-5 object-contain"
                />
              </div>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="font-fun text-egg-pixel-black text-sm">
            New to Eggconomy? Just enter your name and password to create an account!
          </p>
        </div>

        <div className="mt-4">
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