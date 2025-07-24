'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Login() {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

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
    const userSession = {
      name: formData.name,
      isLoggedIn: true,
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem('userSession', JSON.stringify(userSession));
    
    setIsSubmitting(false);
    
    // Redirect to homepage
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-egg-yolkLight to-egg-white flex items-center justify-center">
      <div className="bg-egg-white/90 backdrop-blur-sm rounded-none p-8 shadow-pixel border-3 border-egg-yolk max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">🥚</div>
          <h2 className="text-3xl font-pixel font-bold text-egg-pixel-black mb-2">
            WELCOME TO EGGCONOMY
          </h2>
          <p className="text-egg-pixel-black font-fun">
            Sign in to manage your egg listings
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
                <div className="text-2xl animate-wiggle">🥚</div>
                <span>SIGNING IN...</span>
              </div>
            ) : (
              'SIGN IN 🥚'
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