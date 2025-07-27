'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Character {
  animal: 'cow' | 'pig' | 'chick';
  accessory: 'none' | 'bow' | 'moustache' | 'hat';
  name: string;
}

export default function Login() {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [currentEggFrame, setCurrentEggFrame] = useState(0);

  // Array of egg GIF frames
  const eggFrames = [
    '/egg gif 1.png', '/egg gif 2.png', '/egg gif 3.png', '/egg gif 4.png', '/egg gif 5.png'
  ];

  // Cycle through egg frames every 500ms
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEggFrame(prev => (prev + 1) % eggFrames.length);
    }, 500);

    return () => clearInterval(interval);
  }, [eggFrames.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Simple validation
    if (!formData.name.trim() || !formData.password.trim()) {
      setError('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    // Simulate login process
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Store user session (in a real app, you'd verify credentials with a server)
    const userSession: {
      name: string;
      isLoggedIn: boolean;
      loginTime: string;
      character?: Character;
    } = {
      name: formData.name,
      isLoggedIn: true,
      loginTime: new Date().toISOString(),
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
  };

  return (
    <div className="min-h-screen bg-[#ff9e03] flex items-center justify-center">
      <div className="bg-egg-white/90 backdrop-blur-sm rounded-none p-8 shadow-pixel border-3 border-egg-yolk max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center" style={{ animation: 'wobble 2s ease-in-out infinite' }}>
            <Image
              src={eggFrames[currentEggFrame]}
              alt="Welcome to Eggconomy"
              width={96}
              height={96}
              className="w-24 h-24 object-contain"
            />
          </div>
          <h2 className="text-3xl font-pixel font-bold text-egg-pixel-black mb-2">
            WELCOME TO THE EGGCONOMY
          </h2>
          <p className="text-egg-pixel-black font-fun">
            Sign in to manage your listings and trades
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-none font-pixel">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-pixel font-semibold text-egg-pixel-black mb-2">
              YOUR NAME *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border-3 border-egg-pixel-black rounded-none bg-egg-white font-fun shadow-pixel focus:outline-none focus:ring-2 focus:ring-egg-yolk"
              placeholder="e.g., Sarah from Berea"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-pixel font-semibold text-egg-pixel-black mb-2">
              PASSWORD *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border-3 border-egg-pixel-black rounded-none bg-egg-white font-fun shadow-pixel focus:outline-none focus:ring-2 focus:ring-egg-yolk"
              placeholder="Enter your password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-none font-pixel font-semibold text-lg transition-all duration-200 border-2 border-egg-pixel-black shadow-pixel ${
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
                    alt="Signing in"
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain"
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
          <p className="text-egg-pixel-black font-fun text-sm">
            Don&apos;t have an account? Just use any name and password to get started!
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link 
            href="/"
            className="text-egg-yolkDark hover:text-egg-yolk font-pixel font-medium"
          >
            ← BACK TO HOME
          </Link>
        </div>
      </div>
    </div>
  );
} 