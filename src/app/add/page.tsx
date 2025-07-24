'use client';

import { useState } from 'react';
import Link from 'next/link';

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

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yolk-light to-shell flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg text-center max-w-md mx-4">
          <div className="text-6xl mb-4 animate-crack">🥚</div>
          <h2 className="text-2xl font-fun font-bold text-gray-800 mb-4">
            Eggs-cellent! 🎉
          </h2>
          <p className="text-gray-600 font-fun mb-6">
            Your egg listing has been posted! It will appear on the homepage shortly.
          </p>
          <Link 
            href="/"
            className="bg-yolk hover:bg-yolk-dark text-gray-800 font-fun font-semibold px-6 py-3 rounded-full transition-colors duration-200 shadow-md inline-block"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yolk-light to-shell">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b-2 border-yolk shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="text-4xl animate-crack">🥚</div>
              <h1 className="text-2xl font-fun font-bold text-gray-800">
                Eggconomy
              </h1>
            </Link>
            <Link 
              href="/"
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-fun font-semibold px-4 py-2 rounded-full transition-colors duration-200"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <h2 className="text-3xl font-fun font-bold text-gray-800 mb-2 text-center">
            Add Your Eggs 🥚
          </h2>
          <p className="text-gray-600 font-fun text-center mb-8">
            Share your fresh eggs with the community!
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-fun font-semibold text-gray-700 mb-2">
                Your Name or Nickname *
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

            {/* Quantity */}
            <div>
              <label htmlFor="quantity" className="block text-sm font-fun font-semibold text-gray-700 mb-2">
                Number of Eggs *
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yolk focus:border-transparent font-fun"
                placeholder="e.g., 12"
              />
            </div>

            {/* Exchange Type */}
            <div>
              <label htmlFor="exchangeType" className="block text-sm font-fun font-semibold text-gray-700 mb-2">
                Exchange Type *
              </label>
              <select
                id="exchangeType"
                name="exchangeType"
                value={formData.exchangeType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yolk focus:border-transparent font-fun"
              >
                <option value="gift">🎁 Gift (Free)</option>
                <option value="barter">🤝 Barter (Trade for something)</option>
                <option value="cash">💵 Cash (Pay money)</option>
                <option value="hybrid">🔄 Hybrid (Both barter and cash options)</option>
              </select>
            </div>

            {/* Barter For */}
            {(formData.exchangeType === 'barter' || formData.exchangeType === 'hybrid') && (
              <div>
                <label htmlFor="barterFor" className="block text-sm font-fun font-semibold text-gray-700 mb-2">
                  What would you like to trade for?
                </label>
                <input
                  type="text"
                  id="barterFor"
                  name="barterFor"
                  value={formData.barterFor}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yolk focus:border-transparent font-fun"
                  placeholder="e.g., Fresh vegetables, homemade bread, firewood"
                />
              </div>
            )}

            {/* Cash Price */}
            {(formData.exchangeType === 'cash' || formData.exchangeType === 'hybrid') && (
              <div>
                <label htmlFor="suggestedCash" className="block text-sm font-fun font-semibold text-gray-700 mb-2">
                  Suggested Price
                </label>
                <input
                  type="text"
                  id="suggestedCash"
                  name="suggestedCash"
                  value={formData.suggestedCash}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yolk focus:border-transparent font-fun"
                  placeholder="e.g., $3/dozen"
                />
              </div>
            )}

            {/* Payment Handles */}
            {(formData.exchangeType === 'cash' || formData.exchangeType === 'hybrid') && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="venmo" className="block text-sm font-fun font-semibold text-gray-700 mb-2">
                    Venmo Handle (optional)
                  </label>
                  <input
                    type="text"
                    id="venmo"
                    name="venmo"
                    value={formData.venmo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yolk focus:border-transparent font-fun"
                    placeholder="e.g., @yourname"
                  />
                </div>
                <div>
                  <label htmlFor="paypal" className="block text-sm font-fun font-semibold text-gray-700 mb-2">
                    PayPal Email (optional)
                  </label>
                  <input
                    type="email"
                    id="paypal"
                    name="paypal"
                    value={formData.paypal}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yolk focus:border-transparent font-fun"
                    placeholder="e.g., yourname@email.com"
                  />
                </div>
              </div>
            )}

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-fun font-semibold text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yolk focus:border-transparent font-fun"
                placeholder="e.g., Berea, KY"
              />
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-fun font-semibold text-gray-700 mb-2">
                Additional Notes (optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yolk focus:border-transparent font-fun resize-none"
                placeholder="e.g., Fresh from our backyard hens! Laid this morning. Perfect for baking."
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
                  <span>Posting your eggs...</span>
                </div>
              ) : (
                'Post Your Eggs! 🥚'
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
} 