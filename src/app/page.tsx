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
    <div className="min-h-screen bg-gradient-to-br from-egg-yolkLight to-egg-white">
      {/* Header */}
      <header className="bg-egg-white/90 backdrop-blur-sm border-b-3 border-egg-yolk shadow-pixel">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-4xl animate-bounce">🥚</div>
              <h1 className="text-2xl font-pixel font-bold text-egg-pixel-black">
                EGGCONOMY
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              {userSession?.isLoggedIn ? (
                <>
                  <span className="text-sm font-fun text-egg-pixel-black">
                    Welcome, {userSession.name}!
                  </span>
                  <Link href="/add" className="bg-egg-yolk hover:bg-egg-yolkDark text-egg-pixel-black font-pixel font-semibold px-4 py-2 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200 hover:shadow-pixel-lg">
                    ADD EGGS
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="bg-egg-pixel-gray hover:bg-egg-pixel-grayDark text-egg-pixel-black font-pixel font-medium px-4 py-2 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200"
                  >
                    LOGOUT
                  </button>
                </>
              ) : (
                <>
                  <Link href="/add" className="bg-egg-yolk hover:bg-egg-yolkDark text-egg-pixel-black font-pixel font-semibold px-4 py-2 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200 hover:shadow-pixel-lg">
                    ADD EGGS
                  </Link>
                  <Link href="/login" className="bg-egg-pixel-gray hover:bg-egg-pixel-grayDark text-egg-pixel-black font-pixel font-medium px-4 py-2 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200">
                    SIGN IN
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
            <label htmlFor="search" className="block text-sm font-pixel font-semibold text-egg-pixel-black mb-2">
              🔍 SEARCH FOR EGGS, GOODS, OR LOCATIONS:
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., vegetables, bread, Berea, fresh eggs..."
                className="w-full px-4 py-3 pl-12 border-3 border-egg-pixel-black rounded-none bg-egg-white font-fun shadow-pixel focus:outline-none focus:ring-2 focus:ring-egg-yolk"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-egg-pixel-black">
                🔍
              </div>
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <label htmlFor="location" className="block text-sm font-pixel font-semibold text-egg-pixel-black mb-2">
              📍 FILTER BY LOCATION:
            </label>
            <select
              id="location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full px-4 py-3 border-3 border-egg-pixel-black rounded-none bg-egg-white font-fun shadow-pixel focus:outline-none focus:ring-2 focus:ring-egg-yolk"
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
            <h2 className="text-lg font-pixel font-semibold text-egg-pixel-black mb-4">
              BROWSE BY EXCHANGE TYPE:
            </h2>
            <div className="flex flex-wrap gap-3">
              {(['all', 'gift', 'barter', 'cash', 'hybrid'] as ExchangeType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => handleFilterClick(type)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-none border-2 border-egg-pixel-black font-pixel font-medium transition-all duration-200 shadow-pixel ${
                    filter === type
                      ? 'bg-egg-yolk text-egg-pixel-black shadow-pixel-lg scale-105'
                      : 'bg-egg-white text-egg-pixel-black hover:bg-egg-yolkLight hover:shadow-pixel-lg'
                  }`}
                >
                  <span className="text-lg">{getExchangeIcon(type)}</span>
                  <span>{getExchangeLabel(type).toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters Button */}
          {(searchQuery || locationFilter || filter !== 'all') && (
            <div className="flex justify-center">
              <button
                onClick={clearFilters}
                className="bg-egg-pixel-gray hover:bg-egg-pixel-grayDark text-egg-pixel-black font-pixel font-medium px-6 py-2 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200"
              >
                🗑️ CLEAR ALL FILTERS
              </button>
            </div>
          )}

          {/* Results Count */}
          <div className="text-center">
            <p className="font-pixel text-egg-pixel-black">
              FOUND {filteredListings.length} EGG LISTING{filteredListings.length !== 1 ? 'S' : ''}
              {(searchQuery || locationFilter || filter !== 'all') && (
                <span className="text-egg-yolkDark">
                  {' '}MATCHING YOUR SEARCH
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Loading Animation */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-6xl animate-wiggle">🥚</div>
          </div>
        )}

        {/* Egg Listings */}
        {!isLoading && (
          <div className="space-y-4">
            {filteredListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-egg-white/90 backdrop-blur-sm rounded-none p-6 shadow-pixel hover:shadow-pixel-lg transition-all duration-200 border-3 border-egg-yolk"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl animate-bounce">{getExchangeIcon(listing.exchangeType)}</div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-pixel font-semibold text-lg text-egg-pixel-black">
                          {listing.name.toUpperCase()}
                        </h3>
                        {/* Show "New" badge for listings added in the last 24 hours */}
                        {new Date(listing.datePosted) > new Date(Date.now() - 24 * 60 * 60 * 1000) && (
                          <span className="bg-blush text-egg-white text-xs font-pixel font-bold px-2 py-1 rounded-none border border-egg-pixel-black">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-fun text-egg-pixel-black">{listing.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-pixel font-bold text-xl text-egg-yolkDark">
                      {listing.quantity} EGGS
                    </div>
                    <div className="text-xs font-fun text-egg-pixel-black">
                      {new Date(listing.datePosted).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-egg-pixel-black font-fun">{listing.notes}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {listing.exchangeType === 'barter' && listing.barterFor && (
                    <span className="bg-grass/30 text-egg-pixel-black px-3 py-1 rounded-none border border-egg-pixel-black text-sm font-pixel">
                      WANTS: {listing.barterFor.toUpperCase()}
                    </span>
                  )}
                  {listing.exchangeType === 'cash' && listing.suggestedCash && (
                    <span className="bg-sky/30 text-egg-pixel-black px-3 py-1 rounded-none border border-egg-pixel-black text-sm font-pixel">
                      {listing.suggestedCash.toUpperCase()}
                    </span>
                  )}
                  {listing.exchangeType === 'hybrid' && (
                    <>
                      {listing.barterFor && (
                        <span className="bg-grass/30 text-egg-pixel-black px-3 py-1 rounded-none border border-egg-pixel-black text-sm font-pixel">
                          TRADE: {listing.barterFor.toUpperCase()}
                        </span>
                      )}
                      {listing.suggestedCash && (
                        <span className="bg-sky/30 text-egg-pixel-black px-3 py-1 rounded-none border border-egg-pixel-black text-sm font-pixel">
                          OR: {listing.suggestedCash.toUpperCase()}
                        </span>
                      )}
                    </>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t-2 border-egg-pixel-gray flex justify-between items-center">
                  <button className="bg-egg-yolk hover:bg-egg-yolkDark text-egg-pixel-black font-pixel font-semibold px-4 py-2 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200 hover:shadow-pixel-lg">
                    CRACK A DEAL! 🥚
                  </button>
                  
                  {/* Delete button - only show for logged-in user's own listings */}
                  {userSession?.isLoggedIn && 
                   !mockListings.find(mock => mock.id === listing.id) && 
                   listing.name === userSession.name && (
                    <button 
                      onClick={() => handleDeleteListing(listing.id)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 font-pixel font-medium px-3 py-2 rounded-none border-2 border-red-700 shadow-pixel transition-all duration-200 text-sm"
                      title="Delete this listing"
                    >
                      🗑️ DELETE
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
            <div className="text-6xl mb-4 animate-bounce">🥚</div>
            <h3 className="text-xl font-pixel font-semibold text-egg-pixel-black mb-2">
              NO EGGS FOUND
            </h3>
            <p className="text-egg-pixel-black font-fun mb-4">
              {searchQuery || locationFilter || filter !== 'all' 
                ? 'Try adjusting your search or filters!'
                : 'Be the first to post some eggs!'
              }
            </p>
            <Link 
              href="/add"
              className="bg-egg-yolk hover:bg-egg-yolkDark text-egg-pixel-black font-pixel font-semibold px-6 py-3 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200 hover:shadow-pixel-lg inline-block"
            >
              ADD YOUR EGGS! 🥚
            </Link>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-egg-white/90 backdrop-blur-sm border-t-3 border-egg-yolk mt-12 shadow-pixel">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <p className="font-pixel text-egg-pixel-black">
            🥚 BUILDING COMMUNITY, ONE EGG AT A TIME 🥚
          </p>
        </div>
      </footer>
    </div>
  );
}
