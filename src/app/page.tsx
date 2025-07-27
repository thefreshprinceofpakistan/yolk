'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
];

type ExchangeType = 'all' | 'gift' | 'barter' | 'cash';

type Listing = {
  id: string;
  name: string;
  quantity: number;
  exchangeType: 'gift' | 'barter' | 'cash' | 'hybrid';
  location: string;
  notes?: string;
  datePosted: string;
  barterFor?: string;
  suggestedCash?: string;
  paymentHandles?: {
    venmo?: string;
    paypal?: string;
  };
};

export default function Home() {
  const [filter, setFilter] = useState<ExchangeType>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [allListings, setAllListings] = useState<Listing[]>(mockListings);
  const [userSession, setUserSession] = useState<{ id: string; name: string; isLoggedIn: boolean } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [selectedDeal, setSelectedDeal] = useState<Listing | null>(null);
  const [showDealModal, setShowDealModal] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [messageForm, setMessageForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Array of just two pixel art frame images to alternate between
  const pixelFrames = [
    '/pixil-frame-0 (9).png',        // Raw egg
    '/pixil-frame-0 (5)-trimmed.png'     // Fried egg (trimmed)
  ];

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

    // Load saved listings
    const savedListings = localStorage.getItem('eggListings');
    if (savedListings) {
      try {
        const listings = JSON.parse(savedListings);
        setAllListings([...mockListings, ...listings]);
      } catch (error) {
        console.error('Error loading listings:', error);
      }
    }
  }, []);

  // Switch images on each bounce (every 1 second)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrameIndex(prev => (prev + 1) % pixelFrames.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [pixelFrames.length]);

  // Close mobile menu when clicking outside or resizing to desktop
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMobileMenuOpen && !target.closest('header')) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobileMenuOpen]);

  // Get unique locations for filter dropdown
  const uniqueLocations = Array.from(new Set(allListings.map(listing => listing.location))).sort();

  // Filter listings based on search query, location, and exchange type
  const filteredListings = allListings.filter(listing => {
    // Exchange type filter
    if (filter !== 'all') {
      if (filter === 'barter' && listing.exchangeType !== 'barter' && listing.exchangeType !== 'hybrid') {
        return false;
      }
      if (filter === 'cash' && listing.exchangeType !== 'cash' && listing.exchangeType !== 'hybrid') {
        return false;
      }
      if (filter === 'gift' && listing.exchangeType !== 'gift') {
        return false;
      }
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
      case 'gift': return '/pixil-frame-0 (6).png'; // Gift box
      case 'barter': return '/Adobe Express - file (1).png'; // Handshake
      case 'cash': return '/pixil-frame-0 (7).png'; // Cash/money
      case 'hybrid': return '🔄';
      default: return '/pixil-frame-0 (9).png'; // Raw egg pixel art
    }
  };

  const renderExchangeIcon = (type: string, size: string = 'text-lg') => {
    const icon = getExchangeIcon(type);
    if (icon.startsWith('/')) {
      // It's an image path
      const isCash = type === 'cash';
      const isGift = type === 'gift';
      const isBarter = type === 'barter';
      return (
        <Image
          src={icon}
          alt={`${type} icon`}
          width={isCash ? 40 : isGift || isBarter ? 28 : 20}
          height={isCash ? 40 : isGift || isBarter ? 28 : 20}
          className={`${size} object-contain`}
        />
      );
    } else {
      // It's an emoji
      return <span className={size}>{icon}</span>;
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

  const handleCrackDeal = (listing: Listing) => {
    if (!userSession?.isLoggedIn) {
      alert('Please sign in to start a conversation!');
      return;
    }
    
    setSelectedDeal(listing);
    setShowDealModal(true);
    setShowMessageForm(false);
    setMessageSent(false);
  };

  const closeDealModal = () => {
    setShowDealModal(false);
    setSelectedDeal(null);
    setShowMessageForm(false);
    setMessageSent(false);
    setMessageForm({ name: '', email: '', phone: '', message: '' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingMessage(true);

    // Create message object
    const newMessage = {
      id: Date.now().toString(),
      listingId: selectedDeal?.id,
      listingName: selectedDeal?.name,
      from: messageForm.name,
      email: messageForm.email,
      phone: messageForm.phone,
      message: messageForm.message,
      timestamp: new Date().toISOString(),
    };

    // Save to localStorage
    try {
      const existingMessages = localStorage.getItem('eggMessages');
      const savedMessages = existingMessages ? JSON.parse(existingMessages) : [];
      savedMessages.push(newMessage);
      localStorage.setItem('eggMessages', JSON.stringify(savedMessages));
    } catch (error) {
      console.error('Error saving message:', error);
    }

    // Simulate sending delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSendingMessage(false);
    setMessageSent(true);
    
    // Reset form
    setMessageForm({ name: '', email: '', phone: '', message: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMessageForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-[#FFCF08]">
      {/* Header */}
      <header className="bg-egg-white/90 backdrop-blur-sm border-b-3 border-egg-yolk shadow-pixel">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="animate-bounce w-25 h-25 flex items-center justify-center">
                <Image
                  src={pixelFrames[currentFrameIndex]}
                  alt="Egg animation frame"
                  width={100}
                  height={100}
                  className="w-25 h-25 object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-pixel font-bold text-egg-pixel-black">
                  EGGCONOMY
                </h1>
                <p className="text-sm font-fun text-egg-yolkDark hidden sm:block">
                  Cheaper, Better, More Together
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-3">
              {userSession?.isLoggedIn ? (
                <>
                  <span className="text-sm font-fun text-egg-pixel-black">
                    Welcome, {userSession.name}!
                  </span>
                  <Link href="/add" className="bg-egg-yolk hover:bg-egg-yolkDark text-egg-pixel-black font-pixel font-semibold px-4 py-2 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200 hover:shadow-pixel-lg">
                    ADD EGGS
                  </Link>
                  <Link href="/messages" className="bg-egg-white hover:bg-egg-yolkLight text-egg-pixel-black font-pixel font-medium px-4 py-2 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200">
                    MESSAGES
                  </Link>
                  <Link href="/mission" className="bg-egg-white hover:bg-egg-yolkLight text-egg-pixel-black font-pixel font-medium px-4 py-2 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200">
                    MISSION
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
                  <Link href="/mission" className="bg-egg-white hover:bg-egg-yolkLight text-egg-pixel-black font-pixel font-medium px-4 py-2 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200">
                    MISSION
                  </Link>
                  <Link href="/login" className="bg-egg-pixel-gray hover:bg-egg-pixel-grayDark text-egg-pixel-black font-pixel font-medium px-4 py-2 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200">
                    SIGN IN
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden bg-egg-white border-2 border-egg-pixel-black shadow-pixel p-2 rounded-none"
              aria-label="Toggle mobile menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1">
                <div className={`w-5 h-0.5 bg-egg-pixel-black transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                <div className={`w-5 h-0.5 bg-egg-pixel-black transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-5 h-0.5 bg-egg-pixel-black transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <div className="pt-4 pb-2 space-y-3 border-t-2 border-egg-yolk mt-4">
              {userSession?.isLoggedIn ? (
                <>
                  <div className="text-center mb-4">
                    <span className="text-sm font-fun text-egg-pixel-black bg-egg-yolkLight px-3 py-1 rounded-none border border-egg-pixel-black">
                      Welcome, {userSession.name}!
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <Link 
                      href="/add" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="bg-egg-yolk hover:bg-egg-yolkDark text-egg-pixel-black font-pixel font-semibold px-4 py-3 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200 hover:shadow-pixel-lg text-center"
                    >
                      ADD EGGS
                    </Link>
                    <Link 
                      href="/messages" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="bg-egg-white hover:bg-egg-yolkLight text-egg-pixel-black font-pixel font-medium px-4 py-3 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200 text-center"
                    >
                      MESSAGES
                    </Link>
                    <Link 
                      href="/mission" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="bg-egg-white hover:bg-egg-yolkLight text-egg-pixel-black font-pixel font-medium px-4 py-3 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200 text-center"
                    >
                      MISSION
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="bg-egg-pixel-gray hover:bg-egg-pixel-grayDark text-egg-pixel-black font-pixel font-medium px-4 py-3 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200 w-full"
                    >
                      LOGOUT
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-3">
                    <Link 
                      href="/add" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="bg-egg-yolk hover:bg-egg-yolkDark text-egg-pixel-black font-pixel font-semibold px-4 py-3 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200 hover:shadow-pixel-lg text-center"
                    >
                      ADD EGGS
                    </Link>
                    <Link 
                      href="/mission" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="bg-egg-white hover:bg-egg-yolkLight text-egg-pixel-black font-pixel font-medium px-4 py-3 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200 text-center"
                    >
                      MISSION
                    </Link>
                    <Link 
                      href="/login" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="bg-egg-pixel-gray hover:bg-egg-pixel-grayDark text-egg-pixel-black font-pixel font-medium px-4 py-3 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200 text-center"
                    >
                      SIGN IN
                    </Link>
                  </div>
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
              <div className="flex items-center space-x-2">
                <Image
                  src="/Adobe Express - file (2).png"
                  alt="Search"
                  width={20}
                  height={20}
                  className="w-5 h-5 object-contain"
                />
                <span className="text-xs sm:text-sm">SEARCH FOR EGGS, GOODS, OR LOCATIONS:</span>
              </div>
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., vegetables, bread, Berea, fresh eggs..."
                className="w-full px-4 py-3 pl-12 border-3 border-egg-pixel-black rounded-none bg-egg-white font-fun shadow-pixel focus:outline-none focus:ring-2 focus:ring-egg-yolk text-sm"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Image
                  src="/Adobe Express - file (2).png"
                  alt="Search"
                  width={20}
                  height={20}
                  className="w-5 h-5 object-contain"
                />
              </div>
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <label htmlFor="location" className="block text-sm font-pixel font-semibold text-egg-pixel-black mb-2">
              <div className="flex items-center space-x-2">
                <Image
                  src="/Adobe Express - file (3).png"
                  alt="Location"
                  width={20}
                  height={20}
                  className="w-5 h-5 object-contain"
                />
                <span className="text-xs sm:text-sm">FILTER BY LOCATION:</span>
              </div>
            </label>
            <select
              id="location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full px-4 py-3 border-3 border-egg-pixel-black rounded-none bg-egg-white font-fun shadow-pixel focus:outline-none focus:ring-2 focus:ring-egg-yolk text-sm"
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
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3">
              {(['all', 'gift', 'barter', 'cash'] as ExchangeType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => handleFilterClick(type)}
                  className={`flex items-center justify-center space-x-2 px-3 sm:px-4 py-3 rounded-none border-2 border-egg-pixel-black font-pixel font-medium transition-all duration-200 shadow-pixel text-sm sm:text-base ${
                    filter === type
                      ? 'bg-egg-yolk text-egg-pixel-black shadow-pixel-lg scale-105'
                      : 'bg-egg-white text-egg-pixel-black hover:bg-egg-yolkLight hover:shadow-pixel-lg'
                  }`}
                >
                  {renderExchangeIcon(type, 'text-base sm:text-lg')}
                  <span className="hidden sm:inline">{getExchangeLabel(type).toUpperCase()}</span>
                  <span className="sm:hidden">{getExchangeLabel(type).toUpperCase().slice(0, 4)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters Button */}
          {(searchQuery || locationFilter || filter !== 'all') && (
            <div className="flex justify-center">
              <button
                onClick={clearFilters}
                className="bg-egg-pixel-gray hover:bg-egg-pixel-grayDark text-egg-pixel-black font-pixel font-medium px-4 sm:px-6 py-3 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200 text-sm sm:text-base"
              >
                🗑️ CLEAR ALL FILTERS
              </button>
            </div>
          )}

          {/* Results Count */}
          <div className="text-center">
            <p className="font-pixel text-egg-pixel-black text-sm sm:text-base">
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
            <div className="animate-wiggle">
              <Image
                src="/pixil-frame-0 (9).png"
                alt="Loading egg"
                width={96}
                height={96}
                className="w-24 h-24 object-contain"
              />
            </div>
          </div>
        )}

        {/* Egg Listings */}
        {!isLoading && (
          <div className="space-y-4">
            {filteredListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-egg-white/90 backdrop-blur-sm rounded-none p-4 sm:p-6 shadow-pixel hover:shadow-pixel-lg transition-all duration-200 border-3 border-egg-yolk"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <div>
                      {renderExchangeIcon(listing.exchangeType, 'text-xl sm:text-2xl')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <h3 className="font-pixel font-semibold text-base sm:text-lg text-egg-pixel-black break-words">
                          {listing.name.toUpperCase()}
                        </h3>
                        {/* Show "New" badge for listings added in the last 24 hours */}
                        {new Date(listing.datePosted) > new Date(Date.now() - 24 * 60 * 60 * 1000) && (
                          <span className="bg-blush text-egg-white text-xs font-pixel font-bold px-2 py-1 rounded-none border border-egg-pixel-black flex-shrink-0">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-fun text-egg-pixel-black">{listing.location}</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="font-pixel font-bold text-lg sm:text-xl text-egg-yolkDark">
                      {listing.quantity} EGGS
                    </div>
                    <div className="text-xs font-fun text-egg-pixel-black">
                      {new Date(listing.datePosted).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-egg-pixel-black font-fun text-sm sm:text-base">{listing.notes}</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {listing.exchangeType === 'barter' && listing.barterFor && (
                    <span className="bg-grass/30 text-egg-pixel-black px-2 sm:px-3 py-1 rounded-none border border-egg-pixel-black text-xs sm:text-sm font-pixel">
                      WANTS: {listing.barterFor.toUpperCase()}
                    </span>
                  )}
                  {listing.exchangeType === 'cash' && listing.suggestedCash && (
                    <span className="bg-sky/30 text-egg-pixel-black px-2 sm:px-3 py-1 rounded-none border border-egg-pixel-black text-xs sm:text-sm font-pixel">
                      {listing.suggestedCash.toUpperCase()}
                    </span>
                  )}
                  {listing.exchangeType === 'hybrid' && (
                    <>
                      {listing.barterFor && (
                        <span className="bg-grass/30 text-egg-pixel-black px-2 sm:px-3 py-1 rounded-none border border-egg-pixel-black text-xs sm:text-sm font-pixel">
                          TRADE: {listing.barterFor.toUpperCase()}
                        </span>
                      )}
                      {listing.suggestedCash && (
                        <span className="bg-sky/30 text-egg-pixel-black px-2 sm:px-3 py-1 rounded-none border border-egg-pixel-black text-xs sm:text-sm font-pixel">
                          OR: {listing.suggestedCash.toUpperCase()}
                        </span>
                      )}
                    </>
                  )}
                </div>

                <div className="pt-3 border-t-2 border-egg-pixel-gray flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
                  <button 
                    onClick={() => handleCrackDeal(listing)}
                    className="bg-egg-yolk hover:bg-egg-yolkDark text-egg-pixel-black font-pixel font-semibold px-4 py-3 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200 hover:shadow-pixel-lg text-sm sm:text-base"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span>START CHAT</span>
                      <Image
                        src="/pixil-frame-0 (9).png"
                        alt="Deal"
                        width={20}
                        height={20}
                        className="w-5 h-5 object-contain"
                      />
                    </div>
                  </button>
                  
                  {/* Delete button • only show for logged-in user's own listings */}
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
          <div className="text-center py-8 sm:py-12 px-4">
            <div className="mb-4 animate-bounce">
              <Image
                src="/pixil-frame-0 (9).png"
                alt="No eggs found"
                width={96}
                height={96}
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
              />
            </div>
            <h3 className="text-lg sm:text-xl font-pixel font-semibold text-egg-pixel-black mb-2">
              NO EGGS FOUND
            </h3>
            <p className="text-egg-pixel-black font-fun mb-4 text-sm sm:text-base">
              {searchQuery || locationFilter || filter !== 'all' 
                ? 'Try adjusting your search or filters!'
                : 'Be the first to post some eggs!'
              }
            </p>
            <Link 
              href="/add"
              className="bg-egg-yolk hover:bg-egg-yolkDark text-egg-pixel-black font-pixel font-semibold px-4 sm:px-6 py-3 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200 hover:shadow-pixel-lg inline-block text-sm sm:text-base"
            >
              <div className="flex items-center justify-center space-x-2">
                <span>ADD YOUR EGGS!</span>
                <Image
                  src="/pixil-frame-0 (9).png"
                  alt="Add eggs"
                  width={20}
                  height={20}
                  className="w-5 h-5 object-contain"
                />
              </div>
            </Link>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-egg-white/90 backdrop-blur-sm border-t-3 border-egg-yolk mt-12 shadow-pixel">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <p className="font-pixel text-egg-pixel-black flex items-center justify-center space-x-2 text-sm sm:text-base flex-wrap">
            <Image
              src="/pixil-frame-0 (9).png"
              alt="Egg"
              width={20}
              height={20}
              className="w-5 h-5 object-contain"
            />
            <span className="text-center">BUILDING COMMUNITY, ONE EGG AT A TIME</span>
            <Image
              src="/pixil-frame-0 (9).png"
              alt="Egg"
              width={20}
              height={20}
              className="w-5 h-5 object-contain"
            />
          </p>
        </div>
      </footer>

      {/* Deal Modal */}
      {showDealModal && selectedDeal && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-none border-3 border-egg-yolk shadow-pixel-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <div className="mb-4 animate-bounce">
                <Image
                  src="/pixil-frame-0 (9).png"
                  alt="Crack a deal"
                  width={64}
                  height={64}
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h2 className="text-2xl font-pixel font-bold text-egg-pixel-black mb-2">
                CRACK A DEAL!
              </h2>
              <p className="font-fun text-egg-pixel-black">
                Get in touch with {selectedDeal.name}
              </p>
            </div>

            {!showMessageForm && !messageSent && (
              <>
                <div className="space-y-4 mb-6">
                  {/* Deal Details */}
                  <div className="bg-yellow-200 p-4 border-2 border-egg-yolk">
                    <h3 className="font-pixel font-semibold text-egg-pixel-black mb-2">
                      DEAL DETAILS:
                    </h3>
                    <div className="font-fun text-egg-pixel-black space-y-1">
                      <p><strong>Quantity:</strong> {selectedDeal.quantity} eggs</p>
                      <p><strong>Location:</strong> {selectedDeal.location}</p>
                      <p><strong>Type:</strong> {getExchangeLabel(selectedDeal.exchangeType)}</p>
                      {selectedDeal.barterFor && (
                        <p><strong>Wants:</strong> {selectedDeal.barterFor}</p>
                      )}
                      {selectedDeal.suggestedCash && (
                        <p><strong>Price:</strong> {selectedDeal.suggestedCash}</p>
                      )}
                    </div>
                  </div>

                  {/* Contact Information */}
                  {selectedDeal.exchangeType === 'cash' || selectedDeal.exchangeType === 'hybrid' ? (
                    <div className="bg-white border-2 border-egg-pixel-black p-4">
                      <h3 className="font-pixel font-semibold text-egg-pixel-black mb-2">
                        PAYMENT METHODS:
                      </h3>
                      <div className="font-fun text-egg-pixel-black space-y-2">
                        {selectedDeal.paymentHandles?.venmo && (
                          <div className="flex items-center space-x-2">
                            <span className="text-green-600">💚</span>
                            <span><strong>Venmo:</strong> {selectedDeal.paymentHandles.venmo}</span>
                          </div>
                        )}
                        {selectedDeal.paymentHandles?.paypal && (
                          <div className="flex items-center space-x-2">
                            <span className="text-blue-600">💙</span>
                            <span><strong>PayPal:</strong> {selectedDeal.paymentHandles.paypal}</span>
                          </div>
                        )}
                        {!selectedDeal.paymentHandles?.venmo && !selectedDeal.paymentHandles?.paypal && (
                          <p className="text-egg-pixel-black">Contact seller for payment details</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white border-2 border-egg-pixel-black p-4">
                      <h3 className="font-pixel font-semibold text-egg-pixel-black mb-2">
                        CONTACT INFO:
                      </h3>
                      <p className="font-fun text-egg-pixel-black">
                        Reach out to {selectedDeal.name} to arrange pickup and discuss details!
                      </p>
                    </div>
                  )}

                  {/* Notes */}
                  {selectedDeal.notes && (
                    <div className="bg-white border-2 border-egg-pixel-black p-4">
                      <h3 className="font-pixel font-semibold text-egg-pixel-black mb-2">
                        NOTES:
                      </h3>
                      <p className="font-fun text-egg-pixel-black">
                        {selectedDeal.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={closeDealModal}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-egg-pixel-black font-pixel font-medium py-3 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200"
                  >
                    CLOSE
                  </button>
                  <button
                    onClick={() => {
                      // Start a conversation
                      if (selectedDeal && userSession) {
                        // For now, we'll use a simple approach • create conversation with the listing owner
                        // In a real app, we'd get the seller ID from the listing
                        const sellerId = selectedDeal.name === 'TestUser1' ? 'f80b7d6f-2cb2-4d60-a2bf-11954ce6addb' : 
                                       selectedDeal.name === 'TestUser2' ? '2dccc0c0-df41-450f-8709-0fa617804f68' : 
                                       userSession.id; // fallback
                        
                        // Create conversation via API
                        fetch('/api/conversations', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            listingId: selectedDeal.id,
                            buyerId: userSession.id,
                            sellerId: sellerId,
                          }),
                        })
                        .then(response => response.json())
                        .then(data => {
                          if (data.conversation) {
                            // Redirect to messages page
                            window.location.href = '/messages';
                          } else {
                            alert('Failed to start conversation. Please try again.');
                          }
                        })
                        .catch(error => {
                          console.error('Error starting conversation:', error);
                          alert('Failed to start conversation. Please try again.');
                        });
                      }
                    }}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-pixel font-semibold py-3 rounded-none border-2 border-blue-700 shadow-pixel transition-all duration-200 hover:shadow-pixel-lg"
                  >
                    START CHAT 💬
                  </button>
                  <button
                    onClick={() => {
                      // Copy contact info to clipboard
                      const contactInfo = [
                        `Egg Deal with ${selectedDeal.name}`,
                        `Quantity: ${selectedDeal.quantity} eggs`,
                        `Location: ${selectedDeal.location}`,
                        `Type: ${getExchangeLabel(selectedDeal.exchangeType)}`,
                        selectedDeal.barterFor && `Wants: ${selectedDeal.barterFor}`,
                        selectedDeal.suggestedCash && `Price: ${selectedDeal.suggestedCash}`,
                        selectedDeal.paymentHandles?.venmo && `Venmo: ${selectedDeal.paymentHandles.venmo}`,
                        selectedDeal.paymentHandles?.paypal && `PayPal: ${selectedDeal.paymentHandles.paypal}`,
                        selectedDeal.notes && `Notes: ${selectedDeal.notes}`,
                      ].filter(Boolean).join('\n');
                      
                      navigator.clipboard.writeText(contactInfo);
                      alert('Deal details copied to clipboard! 📋');
                    }}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-egg-pixel-black font-pixel font-semibold py-3 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200 hover:shadow-pixel-lg"
                  >
                    COPY DEAL INFO 📋
                  </button>
                </div>
              </>
            )}

            {/* Message Form */}
            {showMessageForm && !messageSent && (
              <div className="space-y-4">
                <h3 className="font-pixel font-semibold text-egg-pixel-black text-center mb-4">
                  SEND MESSAGE TO {selectedDeal.name.toUpperCase()}
                </h3>
                
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-pixel font-semibold text-egg-pixel-black mb-2">
                      YOUR NAME *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={messageForm.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-3 border-egg-pixel-black rounded-none bg-white font-fun shadow-pixel focus:outline-none focus:ring-2 focus:ring-egg-yolk"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-pixel font-semibold text-egg-pixel-black mb-2">
                      EMAIL *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={messageForm.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-3 border-egg-pixel-black rounded-none bg-white font-fun shadow-pixel focus:outline-none focus:ring-2 focus:ring-egg-yolk"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-pixel font-semibold text-egg-pixel-black mb-2">
                      PHONE (OPTIONAL)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={messageForm.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-3 border-egg-pixel-black rounded-none bg-white font-fun shadow-pixel focus:outline-none focus:ring-2 focus:ring-egg-yolk"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-pixel font-semibold text-egg-pixel-black mb-2">
                      MESSAGE *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={messageForm.message}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 border-3 border-egg-pixel-black rounded-none bg-white font-fun shadow-pixel focus:outline-none focus:ring-2 focus:ring-egg-yolk resize-none"
                      placeholder="Hi! I&apos;m interested in your eggs. When would be a good time to pick them up?"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowMessageForm(false)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-egg-pixel-black font-pixel font-medium py-3 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200"
                    >
                      BACK
                    </button>
                    <button
                      type="submit"
                      disabled={isSendingMessage}
                      className={`flex-1 py-3 rounded-none font-pixel font-semibold border-2 border-egg-pixel-black shadow-pixel transition-all duration-200 ${
                        isSendingMessage
                          ? 'bg-gray-300 text-egg-pixel-black cursor-not-allowed'
                          : 'bg-green-500 hover:bg-green-600 text-white hover:shadow-pixel-lg'
                      }`}
                    >
                      {isSendingMessage ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-wiggle">
                            <Image
                              src="/pixil-frame-0 (9).png"
                              alt="Sending"
                              width={32}
                              height={32}
                              className="w-8 h-8 object-contain"
                            />
                          </div>
                          <span>SENDING...</span>
                        </div>
                      ) : (
                        'SEND MESSAGE 📤'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Message Sent Success */}
            {messageSent && (
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4 animate-bounce">✅</div>
                <h3 className="text-xl font-pixel font-semibold text-egg-pixel-black">
                  MESSAGE SENT!
                </h3>
                <p className="font-fun text-egg-pixel-black">
                  Your message has been sent to {selectedDeal.name}. They&apos;ll get back to you soon!
                </p>
                <button
                  onClick={closeDealModal}
                  className="bg-green-500 hover:bg-green-600 text-white font-pixel font-semibold px-6 py-3 rounded-none border-2 border-green-700 shadow-pixel transition-all duration-200 hover:shadow-pixel-lg"
                >
                  CLOSE
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
