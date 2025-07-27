'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type ExchangeType = 'gift' | 'barter' | 'cash' | 'hybrid';

export default function AddEggs() {
  const [formData, setFormData] = useState({
    name: '',
    quantity: 12,
    exchangeType: 'gift' as ExchangeType,
    barterFor: '',
    suggestedCash: '',
    paymentHandles: {
      venmo: '',
      paypal: '',
    },
    location: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userSession, setUserSession] = useState<{ name: string; isLoggedIn: boolean } | null>(null);

  // Load user session on component mount
  useEffect(() => {
    const savedSession = localStorage.getItem('userSession');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        setUserSession(session);
        // Auto-populate name field with logged-in user's name
        setFormData(prev => ({
          ...prev,
          name: session.name
        }));
      } catch (error) {
        console.error('Error loading user session:', error);
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'venmo' || name === 'paypal') {
      setFormData(prev => ({
        ...prev,
        paymentHandles: {
          ...prev.paymentHandles,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'quantity' ? parseInt(value) || 0 : value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Input validation
    if (!formData.name.trim() || formData.name.length < 2 || formData.name.length > 50) {
      setError('Name must be between 2 and 50 characters');
      setIsSubmitting(false);
      return;
    }

    if (!formData.quantity || formData.quantity < 1 || formData.quantity > 1000) {
      setError('Quantity must be between 1 and 1000');
      setIsSubmitting(false);
      return;
    }

    if (!formData.location.trim() || formData.location.length < 2 || formData.location.length > 100) {
      setError('Location must be between 2 and 100 characters');
      setIsSubmitting(false);
      return;
    }

    if (formData.notes && formData.notes.length > 500) {
      setError('Notes must be less than 500 characters');
      setIsSubmitting(false);
      return;
    }

    if (formData.barterFor && formData.barterFor.length > 200) {
      setError('Barter request must be less than 200 characters');
      setIsSubmitting(false);
      return;
    }

    if (formData.suggestedCash && formData.suggestedCash.length > 50) {
      setError('Suggested cash amount must be less than 50 characters');
      setIsSubmitting(false);
      return;
    }

    // Validate payment handles
    if (formData.paymentHandles.venmo && !formData.paymentHandles.venmo.startsWith('@')) {
      setError('Venmo handle must start with @');
      setIsSubmitting(false);
      return;
    }

    if (formData.paymentHandles.paypal && !formData.paymentHandles.paypal.includes('@')) {
      setError('PayPal must be a valid email address');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Save to localStorage as fallback
        const newListing = {
          ...formData,
          id: data.listing?.id || Date.now().toString(),
          datePosted: new Date().toISOString().split('T')[0],
        };

        const existingListings = JSON.parse(localStorage.getItem('eggListings') || '[]');
        const updatedListings = [newListing, ...existingListings];
        localStorage.setItem('eggListings', JSON.stringify(updatedListings));

        // Reset form
        setFormData({
          name: '',
          quantity: 12,
          exchangeType: 'gift',
          location: '',
          notes: '',
          barterFor: '',
          suggestedCash: '',
          paymentHandles: {
            venmo: '',
            paypal: '',
          },
        });

        setSuccessMessage('Egg listing added successfully! 🥚');
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        setError(data.error || 'Failed to add listing');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If not logged in, show login prompt
  if (!userSession?.isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-egg-yolkLight to-egg-white flex items-center justify-center">
        <div className="bg-egg-white/90 backdrop-blur-sm rounded-none p-8 shadow-pixel text-center max-w-md mx-4 border-3 border-egg-yolk">
          <div className="flex justify-center items-center mb-4" style={{ animation: 'wobble 2s ease-in-out infinite' }}>
            <Image
              src="/pixil-frame-0 (9).png"
              alt="Sign in required"
              width={96}
              height={96}
              className="w-24 h-24 object-contain"
            />
          </div>
          <h2 className="text-2xl font-pixel font-bold text-egg-pixel-black mb-4">
            SIGN IN REQUIRED
          </h2>
          <p className="text-egg-pixel-black font-fun mb-6">
            Please sign in to add your listings!
          </p>
          <Link 
            href="/login"
            className="bg-egg-yolk hover:bg-egg-yolkDark text-egg-pixel-black font-pixel font-semibold px-6 py-3 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200 hover:shadow-pixel-lg inline-block"
          >
            SIGN IN
          </Link>
        </div>
      </div>
    );
  }

  if (successMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-egg-yolkLight to-egg-white flex items-center justify-center">
        <div className="bg-egg-white/90 backdrop-blur-sm rounded-none p-8 shadow-pixel text-center max-w-md mx-4 border-3 border-egg-yolk">
          <div className="mb-4 animate-bounce">
            <Image
              src="/pixil-frame-0 (9).png"
              alt="Success"
              width={96}
              height={96}
              className="w-24 h-24 object-contain"
            />
          </div>
          <h2 className="text-2xl font-pixel font-bold text-egg-pixel-black mb-4">
            EGGS-CELLENT! 🎉
          </h2>
          <p className="text-egg-pixel-black font-fun mb-6">
            Your egg listing has been posted! It will appear on the homepage shortly.
          </p>
          <Link 
            href="/"
            className="bg-egg-yolk hover:bg-egg-yolkDark text-egg-pixel-black font-pixel font-semibold px-6 py-3 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200 hover:shadow-pixel-lg inline-block"
          >
            BACK TO HOME
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-egg-yolkLight to-egg-white">
      {/* Header */}
      <header className="bg-egg-white/90 backdrop-blur-sm border-b-3 border-egg-yolk shadow-pixel">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="animate-bounce">
                <Image
                  src="/pixil-frame-0 (9).png"
                  alt="Eggconomy"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain"
                />
              </div>
              <h1 className="text-2xl font-pixel font-bold text-egg-pixel-black">
                EGGCONOMY
              </h1>
            </Link>
            <Link 
              href="/"
              className="bg-egg-pixel-gray hover:bg-egg-pixel-grayDark text-egg-pixel-black font-pixel font-semibold px-4 py-2 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200"
            >
              ← BACK TO HOME
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-egg-white/90 backdrop-blur-sm rounded-none p-8 shadow-pixel border-3 border-egg-yolk">
          <h2 className="text-3xl font-pixel font-bold text-egg-pixel-black mb-2 text-center flex items-center justify-center space-x-2">
            <span>ADD YOUR EGGS</span>
            <Image
              src="/pixil-frame-0 (9).png"
              alt="Add eggs"
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
            />
          </h2>
          <p className="text-egg-pixel-black font-fun text-center mb-8">
            Share your fresh eggs with the community!
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name • pre-filled and read-only for logged-in users */}
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
                readOnly
                className="w-full px-4 py-3 border-3 border-egg-pixel-black rounded-none bg-egg-pixel-gray font-fun shadow-pixel"
                placeholder="e.g., Sarah from Berea"
              />
              <p className="text-xs text-egg-pixel-black mt-1 font-fun">
                Your name is automatically filled from your account
              </p>
            </div>

            {/* Quantity */}
            <div>
              <label htmlFor="quantity" className="block text-sm font-pixel font-semibold text-egg-pixel-black mb-2">
                NUMBER OF EGGS *
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full px-4 py-3 border-3 border-egg-pixel-black rounded-none bg-egg-white font-fun shadow-pixel focus:outline-none focus:ring-2 focus:ring-egg-yolk"
                placeholder="e.g., 12"
              />
            </div>

            {/* Exchange Type */}
            <div>
              <label htmlFor="exchangeType" className="block text-sm font-pixel font-semibold text-egg-pixel-black mb-2">
                EXCHANGE TYPE *
              </label>
              <select
                id="exchangeType"
                name="exchangeType"
                value={formData.exchangeType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-3 border-egg-pixel-black rounded-none bg-egg-white font-fun shadow-pixel focus:outline-none focus:ring-2 focus:ring-egg-yolk"
              >
                <option value="gift">🎁 GIFT (FREE)</option>
                <option value="barter">🤝 BARTER (TRADE FOR SOMETHING)</option>
                <option value="cash">💵 CASH (PAY MONEY)</option>
                <option value="hybrid">🔄 HYBRID (BOTH BARTER AND CASH OPTIONS)</option>
              </select>
            </div>

            {/* Barter For */}
            {(formData.exchangeType === 'barter' || formData.exchangeType === 'hybrid') && (
              <div>
                <label htmlFor="barterFor" className="block text-sm font-pixel font-semibold text-egg-pixel-black mb-2">
                  WHAT WOULD YOU LIKE TO TRADE FOR?
                </label>
                <input
                  type="text"
                  id="barterFor"
                  name="barterFor"
                  value={formData.barterFor}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-3 border-egg-pixel-black rounded-none bg-egg-white font-fun shadow-pixel focus:outline-none focus:ring-2 focus:ring-egg-yolk"
                  placeholder="e.g., Fresh vegetables, homemade bread, firewood"
                />
              </div>
            )}

            {/* Cash Price */}
            {(formData.exchangeType === 'cash' || formData.exchangeType === 'hybrid') && (
              <div>
                <label htmlFor="suggestedCash" className="block text-sm font-pixel font-semibold text-egg-pixel-black mb-2">
                  SUGGESTED PRICE
                </label>
                <input
                  type="text"
                  id="suggestedCash"
                  name="suggestedCash"
                  value={formData.suggestedCash}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-3 border-egg-pixel-black rounded-none bg-egg-white font-fun shadow-pixel focus:outline-none focus:ring-2 focus:ring-egg-yolk"
                  placeholder="e.g., $3/dozen"
                />
              </div>
            )}

            {/* Payment Handles */}
            {(formData.exchangeType === 'cash' || formData.exchangeType === 'hybrid') && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="venmo" className="block text-sm font-pixel font-semibold text-egg-pixel-black mb-2">
                    VENMO HANDLE (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    id="venmo"
                    name="venmo"
                    value={formData.paymentHandles.venmo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-3 border-egg-pixel-black rounded-none bg-egg-white font-fun shadow-pixel focus:outline-none focus:ring-2 focus:ring-egg-yolk"
                    placeholder="e.g., @yourname"
                  />
                </div>
                <div>
                  <label htmlFor="paypal" className="block text-sm font-pixel font-semibold text-egg-pixel-black mb-2">
                    PAYPAL EMAIL (OPTIONAL)
                  </label>
                  <input
                    type="email"
                    id="paypal"
                    name="paypal"
                    value={formData.paymentHandles.paypal}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-3 border-egg-pixel-black rounded-none bg-egg-white font-fun shadow-pixel focus:outline-none focus:ring-2 focus:ring-egg-yolk"
                    placeholder="e.g., yourname@email.com"
                  />
                </div>
              </div>
            )}

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-pixel font-semibold text-egg-pixel-black mb-2">
                LOCATION *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-3 border-egg-pixel-black rounded-none bg-egg-white font-fun shadow-pixel focus:outline-none focus:ring-2 focus:ring-egg-yolk"
                placeholder="e.g., Berea, KY"
              />
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-pixel font-semibold text-egg-pixel-black mb-2">
                ADDITIONAL NOTES (OPTIONAL)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border-3 border-egg-pixel-black rounded-none bg-egg-white font-fun shadow-pixel focus:outline-none focus:ring-2 focus:ring-egg-yolk resize-none"
                placeholder="e.g., Fresh from our backyard hens! Laid this morning. Perfect for baking."
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-none relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
                <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                  <button onClick={() => setError('')} className="text-red-700">
                    <svg className="fill-current h-6 w-6" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.15 2.759 3.152z"/></svg>
                  </button>
                </span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-none relative" role="alert">
                <strong className="font-bold">Success!</strong>
                <span className="block sm:inline"> {successMessage}</span>
                <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                  <button onClick={() => setSuccessMessage('')} className="text-green-700">
                    <svg className="fill-current h-6 w-6" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4z"/></svg>
                  </button>
                </span>
              </div>
            )}

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
                  <div className="text-2xl animate-wiggle">
                    <Image
                      src="/pixil-frame-0 (9).png"
                      alt="Posting"
                      width={32}
                      height={32}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <span>POSTING YOUR EGGS...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>POST YOUR EGGS!</span>
                  <Image
                    src="/pixil-frame-0 (9).png"
                    alt="Post eggs"
                    width={20}
                    height={20}
                    className="w-5 h-5 object-contain"
                  />
                </div>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
} 