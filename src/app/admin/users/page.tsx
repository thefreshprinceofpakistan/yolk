'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface User {
  id: string;
  name: string;
  email: string | null;
  created_at: string;
  last_login: string;
  email_verified: boolean;
  is_active: boolean;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      
      if (data.users) {
        setUsers(data.users);
      } else {
        setError('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
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
          <p className="font-fun text-egg-pixel-black">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#ff9e03] flex items-center justify-center">
        <div className="bg-egg-white/90 backdrop-blur-sm rounded-none p-8 shadow-pixel border-3 border-egg-yolk text-center">
          <h2 className="text-2xl font-pixel font-bold text-egg-pixel-black mb-4">
            ERROR
          </h2>
          <p className="font-fun text-egg-pixel-black mb-6">{error}</p>
          <button
            onClick={fetchUsers}
            className="bg-egg-yolk hover:bg-egg-yolkDark text-egg-pixel-black font-pixel font-semibold px-6 py-3 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200 hover:shadow-pixel-lg"
          >
            RETRY
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="bg-egg-white/90 backdrop-blur-sm rounded-none shadow-pixel border-3 border-egg-yolk">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-pixel font-bold text-egg-pixel-black">
              USERS ({users.length})
            </h2>
            <button
              onClick={fetchUsers}
              className="bg-egg-yolk hover:bg-egg-yolkDark text-egg-pixel-black font-pixel font-semibold px-4 py-2 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200 hover:shadow-pixel-lg"
            >
              REFRESH
            </button>
          </div>

          {users.length === 0 ? (
            <div className="text-center py-8">
              <Image
                src="/pixil-frame-0 (9).png"
                alt="No users"
                width={80}
                height={80}
                className="w-20 h-20 object-contain mx-auto mb-4"
              />
              <p className="font-fun text-egg-pixel-black">No users found!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-egg-yolk">
                    <th className="text-left py-3 px-4 font-pixel font-semibold text-egg-pixel-black">
                      NAME
                    </th>
                    <th className="text-left py-3 px-4 font-pixel font-semibold text-egg-pixel-black">
                      EMAIL
                    </th>
                    <th className="text-left py-3 px-4 font-pixel font-semibold text-egg-pixel-black">
                      CREATED
                    </th>
                    <th className="text-left py-3 px-4 font-pixel font-semibold text-egg-pixel-black">
                      LAST LOGIN
                    </th>
                    <th className="text-left py-3 px-4 font-pixel font-semibold text-egg-pixel-black">
                      STATUS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-egg-yolkLight hover:bg-egg-yolkLight/30">
                      <td className="py-3 px-4">
                        <span className="font-pixel font-semibold text-egg-pixel-black">
                          {user.name}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-fun text-egg-pixel-black">
                          {user.email || '—'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-fun text-sm text-egg-pixel-black">
                          {formatDate(user.created_at)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-fun text-sm text-egg-pixel-black">
                          {formatDate(user.last_login)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-pixel font-semibold rounded-none ${
                          user.is_active 
                            ? 'bg-green-100 text-green-800 border border-green-300' 
                            : 'bg-red-100 text-red-800 border border-red-300'
                        }`}>
                          {user.is_active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                        {user.email_verified && (
                          <span className="ml-2 inline-flex px-2 py-1 text-xs font-pixel font-semibold rounded-none bg-blue-100 text-blue-800 border border-blue-300">
                            VERIFIED
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 