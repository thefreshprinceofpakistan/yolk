'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { checkAdminAuth, AdminUser } from '@/lib/admin';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAdminAuthState();
  }, []);

  const checkAdminAuthState = () => {
    const admin = checkAdminAuth();
    if (admin) {
      setIsAuthenticated(true);
      setAdminUser(admin);
    } else {
      setIsAuthenticated(false);
      setAdminUser(null);
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    setIsAuthenticated(false);
    setAdminUser(null);
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#ff9e03] flex items-center justify-center">
        <div className="bg-egg-white/90 backdrop-blur-sm rounded-none p-8 shadow-pixel border-3 border-egg-yolk text-center">
          <div className="animate-bounce mb-4">
            <Image
              src="/pixil-frame-0 (9).png"
              alt="Loading"
              width={60}
              height={60}
              className="w-15 h-15 object-contain mx-auto"
            />
          </div>
          <p className="font-fun text-egg-pixel-black">Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#ff9e03] flex items-center justify-center">
        <div className="bg-egg-white/90 backdrop-blur-sm rounded-none p-8 shadow-pixel border-3 border-egg-yolk text-center max-w-md mx-4">
          <div className="flex justify-center mb-6">
            <Image
              src="/pixil-frame-0 (9).png"
              alt="Admin access required"
              width={80}
              height={80}
              className="w-20 h-20 object-contain animate-bounce"
            />
          </div>
          <h2 className="text-2xl font-pixel font-bold text-egg-pixel-black mb-4">
            ADMIN ACCESS REQUIRED
          </h2>
          <p className="text-egg-pixel-black font-fun mb-6">
            You must be logged in as an admin to access this panel.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-egg-yolk hover:bg-egg-yolkDark text-egg-pixel-black font-pixel font-semibold px-6 py-3 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200 hover:shadow-pixel-lg"
            >
              SIGN IN
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-egg-pixel-gray hover:bg-egg-pixel-grayDark text-egg-pixel-black font-pixel font-semibold px-6 py-3 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200"
            >
              BACK TO HOME
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ff9e03]">
      {/* Admin Header */}
      <header className="bg-egg-white/90 backdrop-blur-sm border-b-3 border-egg-yolk shadow-pixel">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image
                src="/pixil-frame-0 (9).png"
                alt="Admin"
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
              />
              <div>
                <h1 className="text-2xl font-pixel font-bold text-egg-pixel-black">
                  EGGCONOMY ADMIN
                </h1>
                <p className="text-sm font-fun text-egg-yolkDark">
                  Welcome, {adminUser?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-pixel font-semibold px-4 py-2 rounded-none border-2 border-red-700 shadow-pixel transition-all duration-200"
              >
                LOGOUT
              </button>
              <button
                onClick={() => router.push('/')}
                className="bg-egg-yolk hover:bg-egg-yolkDark text-egg-pixel-black font-pixel font-semibold px-4 py-2 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200 hover:shadow-pixel-lg"
              >
                BACK TO SITE
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Navigation */}
      <nav className="bg-egg-yolkLight/50 border-b-2 border-egg-yolk">
        <div className="max-w-6xl mx-auto px-4 py-2">
          <div className="flex space-x-4">
            <button
              onClick={() => router.push('/admin/users')}
              className="font-pixel font-semibold text-egg-pixel-black px-4 py-2 rounded-none border-2 border-egg-yolk bg-egg-white hover:bg-egg-yolkLight/30 transition-colors"
            >
              USERS
            </button>
            {/* Add more admin navigation items here as needed */}
          </div>
        </div>
      </nav>

      {/* Admin Content */}
      <main>
        {children}
      </main>
    </div>
  );
} 