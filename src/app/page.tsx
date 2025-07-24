'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Mock data for egg listings
const mockListings = [
  {
    id: '1',
    name: 'Sarah from Berea',
    quantity: 12,
    exchangeType: 'gift' as const,
    location: 'Berea, KY',
    notes: 'Fresh from our backyard hens! Laid this morning.',
    datePosted: '2024-01-15',
  },
  {
    id: '2',
    name: 'Mike\'s Farm',
    quantity: 24,
    exchangeType: 'barter' as const,
    barterFor: 'Fresh vegetables or homemade bread',
    location: 'Richmond, KY',
    notes: 'Organic, free-range eggs. Looking to trade for garden produce.',
    datePosted: '2024-01-14',
  },
  {
    id: '3',
    name: 'Granny Betty',
    quantity: 6,
    exchangeType: 'cash' as const,
    suggestedCash: '$3/dozen',
    paymentHandles: {
      venmo: '@grannybetty',
    },
    location: 'Berea, KY',
    notes: 'Small batch, very fresh. Perfect for baking!',
    datePosted: '2024-01-13',
  },
  {
    id: '4',
    name: 'The Johnson Family',
    quantity: 18,
    exchangeType: 'hybrid' as const,
    barterFor: 'Firewood or help with yard work',
    suggestedCash: '$4/dozen',
    paymentHandles: {
      venmo: '@johnsonfarm',
      paypal: 'johnsonfarm@email.com',
    },
    location: 'Lancaster, KY',
    notes: 'Large brown eggs from happy hens. Will trade or sell!',
    datePosted: '2024-01-12',
  },
];

type ExchangeType = 'all' | 'gift' | 'barter' | 'cash' | 'hybrid';

export default function Home() {
  const [filter, setFilter] = useState<ExchangeType>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [allListings, setAllListings] = useState(mockListings);

  // Load user-submitted listings from localStorage on component mount
  useEffect(() => {
    const savedListings = localStorage.getItem('eggListings');
    if (savedListings) {
      try {
        const parsedListings = JSON.parse(savedListings);
        setAllListings([...mockListings, ...parsedListings]);
      } catch (error) {
        console.error('Error loading saved listings:', error);
      }
    }
  }, []);

  const filteredListings = filter === 'all' 
    ? allListings 
    : allListings.filter(listing => listing.exchangeType === filter);

  const getExchangeIcon = (type: string) => {
    switch (type) {
      case 'gift': return '🎁';
      case 'barter': return '🤝';
      case 'cash': return '💵';
      case 'hybrid': return '🔄';
      default: return '🥚';
    }
  };

  const getExchangeLabel = (type: string) => {
    switch (type) {
      case 'gift': return 'Gift';
      case 'barter': return 'Barter';
      case 'cash': return 'Cash';
      case 'hybrid': return 'Hybrid';
      default: return 'All';
    }
  };

  const handleFilterClick = (newFilter: ExchangeType) => {
    setIsLoading(true);
    setFilter(newFilter);
    // Simulate loading animation
    setTimeout(() => setIsLoading(false), 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yolk-light to-shell">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b-2 border-yolk shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-4xl animate-crack">🥚</div>
              <h1 className="text-2xl font-fun font-bold text-gray-800">
                Eggconomy
              </h1>
            </div>
            <Link href="/add" className="bg-yolk hover:bg-yolk-dark text-gray-800 font-fun font-semibold px-4 py-2 rounded-full transition-colors duration-200 shadow-md">
              Add Your Eggs
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Filter Buttons */}
        <div className="mb-8">
          <h2 className="text-lg font-fun font-semibold text-gray-700 mb-4">
            Browse by Exchange Type:
          </h2>
          <div className="flex flex-wrap gap-3">
            {(['all', 'gift', 'barter', 'cash', 'hybrid'] as ExchangeType[]).map((type) => (
              <button
                key={type}
                onClick={() => handleFilterClick(type)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full font-fun font-medium transition-all duration-200 ${
                  filter === type
                    ? 'bg-yolk text-gray-800 shadow-md scale-105'
                    : 'bg-white/70 text-gray-600 hover:bg-white hover:shadow-sm'
                }`}
              >
                <span className="text-lg">{getExchangeIcon(type)}</span>
                <span>{getExchangeLabel(type)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Loading Animation */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-6xl animate-crack">🥚</div>
          </div>
        )}

        {/* Egg Listings */}
        {!isLoading && (
          <div className="space-y-4">
            {filteredListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-yolk"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getExchangeIcon(listing.exchangeType)}</div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-fun font-semibold text-lg text-gray-800">
                          {listing.name}
                        </h3>
                        {/* Show "New" badge for listings added in the last 24 hours */}
                        {new Date(listing.datePosted) > new Date(Date.now() - 24 * 60 * 60 * 1000) && (
                          <span className="bg-blush text-white text-xs font-fun font-bold px-2 py-1 rounded-full">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{listing.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-fun font-bold text-xl text-yolk-dark">
                      {listing.quantity} eggs
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(listing.datePosted).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-gray-700 font-fun">{listing.notes}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {listing.exchangeType === 'barter' && listing.barterFor && (
                    <span className="bg-grass/30 text-gray-700 px-3 py-1 rounded-full text-sm font-fun">
                      Wants: {listing.barterFor}
                    </span>
                  )}
                  {listing.exchangeType === 'cash' && listing.suggestedCash && (
                    <span className="bg-sky/30 text-gray-700 px-3 py-1 rounded-full text-sm font-fun">
                      {listing.suggestedCash}
                    </span>
                  )}
                  {listing.exchangeType === 'hybrid' && (
                    <>
                      {listing.barterFor && (
                        <span className="bg-grass/30 text-gray-700 px-3 py-1 rounded-full text-sm font-fun">
                          Trade: {listing.barterFor}
                        </span>
                      )}
                      {listing.suggestedCash && (
                        <span className="bg-sky/30 text-gray-700 px-3 py-1 rounded-full text-sm font-fun">
                          Or: {listing.suggestedCash}
                        </span>
                      )}
                    </>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200">
                  <button className="bg-yolk hover:bg-yolk-dark text-gray-800 font-fun font-semibold px-4 py-2 rounded-full transition-colors duration-200">
                    Crack a Deal! 🥚
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredListings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🥚</div>
            <h3 className="text-xl font-fun font-semibold text-gray-600 mb-2">
              No eggs found for this filter
            </h3>
            <p className="text-gray-500 font-fun">
              Try selecting a different exchange type or check back later!
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t-2 border-yolk mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <p className="font-fun text-gray-600">
            🥚 Building community, one egg at a time 🥚
          </p>
        </div>
      </footer>
    </div>
  );
}
