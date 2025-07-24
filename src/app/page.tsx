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
  const [userSession, setUserSession] = useState<{ name: string; isLoggedIn: boolean } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  // Load user session and listings from localStorage on component mount
  useEffect(() => {
    // Load user session
    const savedSession = localStorage.getItem('userSession');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        setUserSession(session);
      } catch (error) {
        console.error('Error loading user session:', error);
      }
    }

    // Load user-submitted listings
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

  // Get unique locations for filter dropdown
  const uniqueLocations = Array.from(new Set(allListings.map(listing => listing.location))).sort();

  // Filter listings based on search query, location, and exchange type
  const filteredListings = allListings.filter(listing => {
    // Exchange type filter
    if (filter !== 'all' && listing.exchangeType !== filter) {
      return false;
    }

    // Location filter
    if (locationFilter && !listing.location.toLowerCase().includes(locationFilter.toLowerCase())) {
      return false;
    }

    // Search query filter (searches in name, notes, barter items, and location)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const searchableText = [
        listing.name,
        listing.notes,
        listing.location,
        listing.barterFor,
        listing.suggestedCash
      ].filter(Boolean).join(' ').toLowerCase();
      
      if (!searchableText.includes(query)) {
        return false;
      }
    }

    return true;
  });

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

  const handleDeleteListing = (listingId: string) => {
    if (confirm('Are you sure you want to delete this egg listing?')) {
      // Remove from localStorage
      try {
        const savedListings = localStorage.getItem('eggListings');
        if (savedListings) {
          const parsedListings = JSON.parse(savedListings);
          const updatedListings = parsedListings.filter((listing: { id: string }) => listing.id !== listingId);
          localStorage.setItem('eggListings', JSON.stringify(updatedListings));
        }
      } catch (error) {
        console.error('Error deleting listing:', error);
      }

      // Update state
      setAllListings(prev => prev.filter(listing => listing.id !== listingId));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    setUserSession(null);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setLocationFilter('');
    setFilter('all');
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
            <div className="flex items-center space-x-3">
              {userSession?.isLoggedIn ? (
                <>
                  <span className="text-sm font-fun text-gray-600">
                    Welcome, {userSession.name}!
                  </span>
                  <Link href="/add" className="bg-yolk hover:bg-yolk-dark text-gray-800 font-fun font-semibold px-4 py-2 rounded-full transition-colors duration-200 shadow-md">
                    Add Your Eggs
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-fun font-medium px-4 py-2 rounded-full transition-colors duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/add" className="bg-yolk hover:bg-yolk-dark text-gray-800 font-fun font-semibold px-4 py-2 rounded-full transition-colors duration-200 shadow-md">
                    Add Your Eggs
                  </Link>
                  <Link href="/login" className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-fun font-medium px-4 py-2 rounded-full transition-colors duration-200">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div>
            <label htmlFor="search" className="block text-sm font-fun font-semibold text-gray-700 mb-2">
              🔍 Search for eggs, goods, or locations:
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., vegetables, bread, Berea, fresh eggs..."
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yolk focus:border-transparent font-fun"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <label htmlFor="location" className="block text-sm font-fun font-semibold text-gray-700 mb-2">
              📍 Filter by location:
            </label>
            <select
              id="location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yolk focus:border-transparent font-fun"
            >
              <option value="">All locations</option>
              {uniqueLocations.map(location => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Exchange Type Filter */}
          <div>
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

          {/* Clear Filters Button */}
          {(searchQuery || locationFilter || filter !== 'all') && (
            <div className="flex justify-center">
              <button
                onClick={clearFilters}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-fun font-medium px-6 py-2 rounded-full transition-colors duration-200"
              >
                🗑️ Clear All Filters
              </button>
            </div>
          )}

          {/* Results Count */}
          <div className="text-center">
            <p className="font-fun text-gray-600">
              Found {filteredListings.length} egg listing{filteredListings.length !== 1 ? 's' : ''}
              {(searchQuery || locationFilter || filter !== 'all') && (
                <span className="text-yolk-dark">
                  {' '}matching your search
                </span>
              )}
            </p>
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

                <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                  <button className="bg-yolk hover:bg-yolk-dark text-gray-800 font-fun font-semibold px-4 py-2 rounded-full transition-colors duration-200">
                    Crack a Deal! 🥚
                  </button>
                  
                  {/* Delete button - only show for logged-in user's own listings */}
                  {userSession?.isLoggedIn && 
                   !mockListings.find(mock => mock.id === listing.id) && 
                   listing.name === userSession.name && (
                    <button 
                      onClick={() => handleDeleteListing(listing.id)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 font-fun font-medium px-3 py-2 rounded-full transition-colors duration-200 text-sm"
                      title="Delete this listing"
                    >
                      🗑️ Delete
                    </button>
                  )}
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
              No eggs found
            </h3>
            <p className="text-gray-500 font-fun mb-4">
              {searchQuery || locationFilter || filter !== 'all' 
                ? 'Try adjusting your search or filters!'
                : 'Be the first to post some eggs!'
              }
            </p>
            <Link 
              href="/add"
              className="bg-yolk hover:bg-yolk-dark text-gray-800 font-fun font-semibold px-6 py-3 rounded-full transition-colors duration-200 shadow-md inline-block"
            >
              Add Your Eggs! 🥚
            </Link>
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
