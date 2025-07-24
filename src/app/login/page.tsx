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
    <div className="min-h-screen bg-gradient-to-br from-yolk-light to-shell flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-crack">🥚</div>
          <h2 className="text-3xl font-fun font-bold text-gray-800 mb-2">
            Welcome to Eggconomy
          </h2>
          <p className="text-gray-600 font-fun">
            Sign in to manage your egg listings
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg font-fun">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-fun font-semibold text-gray-700 mb-2">
              Your Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yolk focus:border-transparent font-fun"
              placeholder="e.g., Sarah from Berea"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-fun font-semibold text-gray-700 mb-2">
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yolk focus:border-transparent font-fun"
              placeholder="Enter your password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-lg font-fun font-semibold text-lg transition-all duration-200 ${
              isSubmitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-yolk hover:bg-yolk-dark text-gray-800 shadow-md hover:shadow-lg'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="text-2xl animate-crack">🥚</div>
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign In 🥚'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 font-fun text-sm">
            Don&apos;t have an account? Just use any name and password to get started!
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link 
            href="/"
            className="text-yolk-dark hover:text-yolk font-fun font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 