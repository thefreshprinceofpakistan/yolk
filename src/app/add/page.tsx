'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type ExchangeType = 'gift' | 'barter' | 'cash' | 'hybrid';

export default function AddEggs() {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    exchangeType: 'gift' as ExchangeType,
    barterFor: '',
    suggestedCash: '',
    venmo: '',
    paypal: '',
    location: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Create new listing object
    const newListing = {
      id: Date.now().toString(), // Simple ID generation
      name: formData.name,
      quantity: parseInt(formData.quantity),
      exchangeType: formData.exchangeType,
      barterFor: formData.barterFor || undefined,
      suggestedCash: formData.suggestedCash || undefined,
      paymentHandles: {
        venmo: formData.venmo || undefined,
        paypal: formData.paypal || undefined,
      },
      location: formData.location,
      notes: formData.notes || undefined,
      datePosted: new Date().toISOString().split('T')[0], // Today's date
    };

    // Save to localStorage
    try {
      const existingListings = localStorage.getItem('eggListings');
      const savedListings = existingListings ? JSON.parse(existingListings) : [];
      savedListings.push(newListing);
      localStorage.setItem('eggListings', JSON.stringify(savedListings));
    } catch (error) {
      console.error('Error saving listing:', error);
    }
    
    // Simulate form submission delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Redirect to homepage after 3 seconds
    setTimeout(() => {
      window.location.href = '/';
    }, 3000);
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

  if (showSuccess) {
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
                    value={formData.venmo}
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
                    value={formData.paypal}
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