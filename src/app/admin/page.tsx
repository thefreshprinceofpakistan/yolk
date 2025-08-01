'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface UserAccount {
  name: string;
  password: string;
  createdAt: string;
  lastLogin: string;
  listingsCount: number;
}

interface SiteStats {
  totalUsers: number;
  activeUsers: number;
  totalListings: number;
  newUsersToday: number;
  loginsToday: number;
}

export default function AdminDashboard() {
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [stats, setStats] = useState<SiteStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalListings: 0,
    newUsersToday: 0,
    loginsToday: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'createdAt' | 'lastLogin' | 'listingsCount'>('createdAt');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      // Load user accounts
      const storedAccounts = localStorage.getItem('eggAccounts');
      const userAccounts: UserAccount[] = storedAccounts ? JSON.parse(storedAccounts) : [];
      
      // Load egg listings
      const storedListings = localStorage.getItem('eggListings');
      const listings = storedListings ? JSON.parse(storedListings) : [];
      
      // Calculate stats
      const today = new Date().toDateString();
      const newUsersToday = userAccounts.filter(acc => 
        new Date(acc.createdAt).toDateString() === today
      ).length;
      
      const loginsToday = userAccounts.filter(acc => 
        new Date(acc.lastLogin).toDateString() === today
      ).length;

      const activeUsers = userAccounts.filter(acc => {
        const lastLogin = new Date(acc.lastLogin);
        const now = new Date();
        const daysSinceLogin = (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceLogin <= 7; // Active if logged in within 7 days
      }).length;

      setStats({
        totalUsers: userAccounts.length,
        activeUsers,
        totalListings: listings.length,
        newUsersToday,
        loginsToday
      });

      setAccounts(userAccounts);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading admin data:', error);
      setIsLoading(false);
    }
  };

  const filteredAccounts = accounts.filter(account =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedAccounts = [...filteredAccounts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'lastLogin':
        return new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime();
      case 'listingsCount':
        return b.listingsCount - a.listingsCount;
      default:
        return 0;
    }
  });

  const deleteAccount = (accountName: string) => {
    if (window.confirm(`Are you sure you want to delete the account "${accountName}"?`)) {
      try {
        const updatedAccounts = accounts.filter(acc => acc.name !== accountName);
        localStorage.setItem('eggAccounts', JSON.stringify(updatedAccounts));
        setAccounts(updatedAccounts);
        loadData(); // Reload stats
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear ALL site data? This cannot be undone!')) {
      try {
        localStorage.clear();
        setAccounts([]);
        setStats({
          totalUsers: 0,
          activeUsers: 0,
          totalListings: 0,
          newUsersToday: 0,
          loginsToday: 0
        });
      } catch (error) {
        console.error('Error clearing data:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#ff9e03] flex items-center justify-center">
        <div className="bg-egg-white/90 backdrop-blur-sm rounded-none p-8 shadow-pixel border-3 border-egg-yolk max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <div className="animate-bounce mb-4">
              <Image
                src="/pixil-frame-0 (9).png"
                alt="Admin access required"
                width={80}
                height={80}
                className="w-20 h-20 object-contain mx-auto"
              />
            </div>
            <h2 className="text-2xl font-pixel font-bold text-egg-pixel-black mb-4">
              ADMIN ACCESS REQUIRED
            </h2>
            <p className="text-egg-pixel-black font-fun mb-6">
              This page is only accessible to administrators.
            </p>
            <Link 
              href="/"
              className="bg-egg-yolk hover:bg-egg-yolkDark text-egg-pixel-black font-pixel font-semibold px-6 py-3 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200 hover:shadow-pixel-lg inline-block"
            >
              BACK TO HOME
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ff9e03]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b-2 border-yolk shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div>
                <Image
                  src="/pixil-frame-0 (9).png"
                  alt="Admin"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain"
                />
              </div>
              <h1 className="text-2xl font-fun font-bold text-egg-pixel-black">
                Eggconomy Admin Dashboard
              </h1>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={loadData}
                className="bg-yolk hover:bg-yolk-dark text-egg-pixel-black font-fun font-semibold px-4 py-2 rounded-full transition-colors duration-200 shadow-md"
              >
                Refresh Data
              </button>
              <Link
                href="/"
                className="bg-gray-600 hover:bg-gray-700 text-white font-fun font-semibold px-4 py-2 rounded-full transition-colors duration-200 shadow-md"
              >
                Back to Site
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border-l-4 border-blue-500">
            <div className="text-2xl font-fun font-bold text-blue-600">{stats.totalUsers}</div>
            <div className="text-sm text-egg-pixel-black font-fun">Total Users</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border-l-4 border-green-500">
            <div className="text-2xl font-fun font-bold text-green-600">{stats.activeUsers}</div>
            <div className="text-sm text-egg-pixel-black font-fun">Active Users (7d)</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border-l-4 border-purple-500">
            <div className="text-2xl font-fun font-bold text-purple-600">{stats.totalListings}</div>
            <div className="text-sm text-egg-pixel-black font-fun">Total Listings</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border-l-4 border-yellow-500">
            <div className="text-2xl font-fun font-bold text-yellow-600">{stats.newUsersToday}</div>
            <div className="text-sm text-egg-pixel-black font-fun">New Users Today</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border-l-4 border-red-500">
            <div className="text-2xl font-fun font-bold text-red-600">{stats.loginsToday}</div>
            <div className="text-sm text-egg-pixel-black font-fun">Logins Today</div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div>
                <label className="block text-sm font-fun font-semibold text-egg-pixel-black mb-2">
                  Search Users:
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name..."
                  className="px-4 py-2 border-2 border-gray-300 rounded-full font-fun focus:outline-none focus:border-yolk text-egg-pixel-black"
                />
              </div>
              <div>
                <label className="block text-sm font-fun font-semibold text-egg-pixel-black mb-2">
                  Sort By:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'createdAt' | 'lastLogin' | 'listingsCount')}
                  className="px-4 py-2 border-2 border-gray-300 rounded-full font-fun focus:outline-none focus:border-yolk text-egg-pixel-black"
                >
                  <option value="createdAt">Date Created</option>
                  <option value="lastLogin">Last Login</option>
                  <option value="name">Name</option>
                  <option value="listingsCount">Listings Count</option>
                </select>
              </div>
            </div>
            <button
              onClick={clearAllData}
              className="bg-red-600 hover:bg-red-700 text-white font-fun font-semibold px-4 py-2 rounded-full transition-colors duration-200 shadow-md"
            >
              Clear All Data
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-fun font-semibold text-egg-pixel-black">
              User Accounts ({filteredAccounts.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-fun font-semibold text-egg-pixel-black uppercase tracking-wider">
                    User Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-fun font-semibold text-egg-pixel-black uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-fun font-semibold text-egg-pixel-black uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-fun font-semibold text-egg-pixel-black uppercase tracking-wider">
                    Listings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-fun font-semibold text-egg-pixel-black uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-fun font-semibold text-egg-pixel-black uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedAccounts.map((account) => {
                  const lastLogin = new Date(account.lastLogin);
                  const now = new Date();
                  const daysSinceLogin = (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24);
                  const isActive = daysSinceLogin <= 7;
                  
                  return (
                    <tr key={account.name} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-fun font-semibold text-egg-pixel-black">{account.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-egg-pixel-black font-fun">
                          {new Date(account.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-egg-pixel-black font-fun">
                          {new Date(account.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-egg-pixel-black font-fun">
                          {lastLogin.toLocaleDateString()}
                        </div>
                        <div className="text-xs text-egg-pixel-black font-fun">
                          {lastLogin.toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-fun font-semibold rounded-full bg-yolk text-egg-pixel-black">
                          {account.listingsCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-fun font-semibold rounded-full ${
                          isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-egg-pixel-black'
                        }`}>
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-fun">
                        <button
                          onClick={() => deleteAccount(account.name)}
                          className="text-red-600 hover:text-red-900 font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {sortedAccounts.length === 0 && (
            <div className="text-center py-8">
              <div className="mb-2">
                <Image
                  src="/pixil-frame-0 (9).png"
                  alt="No users"
                  width={64}
                  height={64}
                  className="w-16 h-16 object-contain"
                />
              </div>
              <p className="text-egg-pixel-black font-fun">No users found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
