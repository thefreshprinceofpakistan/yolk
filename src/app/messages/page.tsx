'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender: {
    name: string;
  };
  sender_id: string;
  photo_url?: string; // Add photo support
}

interface Conversation {
  id: string;
  listing: {
    name: string;
    quantity: number;
    exchange_type: string;
  };
  buyer: {
    name: string;
  };
  seller: {
    name: string;
  };
  status: string;
  updated_at: string;
  messages: Message[];
}

interface User {
  id: string;
  name: string;
  isLoggedIn: boolean;
  loginTime: string;
  character?: {
    animal: 'cow' | 'pig' | 'chick';
    accessory: 'none' | 'bow' | 'moustache' | 'hat';
    name: string;
  };
}

export default function Messages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);

  useEffect(() => {
    // Get current user from localStorage
    const user = JSON.parse(localStorage.getItem('userSession') || 'null');
    setCurrentUser(user);

    if (user?.isLoggedIn) {
      fetchConversations(user.id || user.name); // Use name as fallback if no id
    } else {
      setLoading(false);
    }
  }, []);

  // Refresh conversations when page becomes visible (for new conversations)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && currentUser?.isLoggedIn) {
        fetchConversations(currentUser.id || currentUser.name);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [currentUser]);

  const fetchConversations = async (userId: string) => {
    try {
      const response = await fetch(`/api/conversations?userId=${userId}`);
      const data = await response.json();
      
      if (data.conversations) {
        setConversations(data.conversations);
      } else {
        // Fallback to localStorage for testing
        console.log('Using localStorage fallback for conversations');
        const savedConversations = localStorage.getItem('testConversations');
        if (savedConversations) {
          const allConversations = JSON.parse(savedConversations);
          // Filter to only show conversations where current user is involved
          const userConversations = allConversations.filter((conv: Conversation) => 
            conv.buyer.name === currentUser?.name || conv.seller.name === currentUser?.name
          );
          setConversations(userConversations);
        } else {
          // Create some test conversations for the current user
          const testConversations = [
            {
              id: 'conv1',
              listing: { name: 'Sarah from Berea', quantity: 12, exchange_type: 'gift' },
              buyer: { name: currentUser?.name || 'User' },
              seller: { name: 'Sarah from Berea' },
              status: 'active',
              updated_at: new Date().toISOString(),
              messages: []
            },
            {
              id: 'conv2', 
              listing: { name: "Mike's Farm", quantity: 24, exchange_type: 'barter' },
              buyer: { name: currentUser?.name || 'User' },
              seller: { name: "Mike's Farm" },
              status: 'active',
              updated_at: new Date().toISOString(),
              messages: []
            }
          ];
          setConversations(testConversations);
          localStorage.setItem('testConversations', JSON.stringify(testConversations));
        }
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      // Fallback to localStorage
      const savedConversations = localStorage.getItem('testConversations');
      if (savedConversations) {
        const allConversations = JSON.parse(savedConversations);
        // Filter to only show conversations where current user is involved
        const userConversations = allConversations.filter((conv: Conversation) => 
          conv.buyer.name === currentUser?.name || conv.seller.name === currentUser?.name
        );
        setConversations(userConversations);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/messages?conversationId=${conversationId}`);
      const data = await response.json();
      
      if (data.messages) {
        setMessages(data.messages);
      } else {
        // Fallback to localStorage for testing
        const savedMessages = localStorage.getItem(`messages_${conversationId}`);
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        } else {
          setMessages([]);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Fallback to localStorage
      const savedMessages = localStorage.getItem(`messages_${conversationId}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        setMessages([]);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    return date.toLocaleDateString();
  };

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be smaller than 5MB');
        return;
      }
      setSelectedPhoto(file);
    }
  };

  const uploadPhoto = async (file: File): Promise<string> => {
    // For now, we'll use a simple approach with localStorage
    // In a real app, you'd upload to a cloud service like AWS S3 or Cloudinary
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        resolve(result);
      };
      reader.readAsDataURL(file);
    });
  };

  const sendMessage = async () => {
    if ((!newMessage.trim() && !selectedPhoto) || !selectedConversation || !currentUser) return;

    setUploadingPhoto(true);

    try {
      let photoUrl = '';
      if (selectedPhoto) {
        photoUrl = await uploadPhoto(selectedPhoto);
      }

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          senderId: currentUser.id || currentUser.name,
          content: newMessage.trim(),
          photo_url: photoUrl || undefined,
        }),
      });

      const data = await response.json();
      
      if (data.message) {
        setMessages([...messages, data.message]);
        setNewMessage('');
        setSelectedPhoto(null);
        
        // Refresh conversations to update timestamps
        if (currentUser) {
          fetchConversations(currentUser.id || currentUser.name);
        }
      } else {
        // Fallback to localStorage
        const newMsg = {
          id: Date.now().toString(),
          content: newMessage.trim(),
          created_at: new Date().toISOString(),
          sender: { name: currentUser.name },
          sender_id: currentUser.id || currentUser.name,
          photo_url: photoUrl || undefined
        };
        
        const updatedMessages = [...messages, newMsg];
        setMessages(updatedMessages);
        setNewMessage('');
        setSelectedPhoto(null);
        
        // Save to localStorage
        localStorage.setItem(`messages_${selectedConversation.id}`, JSON.stringify(updatedMessages));
        
        // Update conversation timestamp
        const updatedConversation = { ...selectedConversation, updated_at: new Date().toISOString() };
        setSelectedConversation(updatedConversation);
        
        // Update conversations list
        const updatedConversations = conversations.map(conv => 
          conv.id === selectedConversation.id ? updatedConversation : conv
        );
        setConversations(updatedConversations);
        localStorage.setItem('testConversations', JSON.stringify(updatedConversations));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Fallback to localStorage
      let photoUrl = '';
      if (selectedPhoto) {
        photoUrl = await uploadPhoto(selectedPhoto);
      }

      const newMsg = {
        id: Date.now().toString(),
        content: newMessage.trim(),
        created_at: new Date().toISOString(),
        sender: { name: currentUser.name },
        sender_id: currentUser.id || currentUser.name,
        photo_url: photoUrl || undefined
      };
      
      const updatedMessages = [...messages, newMsg];
      setMessages(updatedMessages);
      setNewMessage('');
      setSelectedPhoto(null);
      
      // Save to localStorage
      localStorage.setItem(`messages_${selectedConversation.id}`, JSON.stringify(updatedMessages));
      
      // Update conversation timestamp
      const updatedConversation = { ...selectedConversation, updated_at: new Date().toISOString() };
      setSelectedConversation(updatedConversation);
      
      // Update conversations list
      const updatedConversations = conversations.map(conv => 
        conv.id === selectedConversation.id ? updatedConversation : conv
      );
      setConversations(updatedConversations);
      localStorage.setItem('testConversations', JSON.stringify(updatedConversations));
    } finally {
      setUploadingPhoto(false);
    }
  };

  const selectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.id);
  };

  const getOtherUserName = (conversation: Conversation) => {
    if (!currentUser) return '';
    return conversation.buyer.name === currentUser.name 
      ? conversation.seller.name 
      : conversation.buyer.name;
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#ff9e03] flex items-center justify-center">
        <div className="bg-egg-white/90 backdrop-blur-sm rounded-none p-8 shadow-pixel border-3 border-egg-yolk text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/pixil-frame-0 (9).png"
              alt="Sign in required"
              width={80}
              height={80}
              className="w-20 h-20 object-contain animate-bounce"
            />
          </div>
          <h2 className="text-2xl font-pixel font-bold text-egg-pixel-black mb-4">
            SIGN IN REQUIRED
          </h2>
          <p className="font-fun text-egg-pixel-black mb-6">
            Please sign in to view your messages!
          </p>
          <Link
            href="/login"
            className="bg-egg-yolk hover:bg-egg-yolkDark text-egg-pixel-black font-pixel font-semibold px-6 py-3 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200 hover:shadow-pixel-lg"
          >
            SIGN IN
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ff9e03]">
      {/* Header */}
      <header className="bg-egg-white/90 backdrop-blur-sm border-b-3 border-egg-yolk shadow-pixel">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="animate-bounce w-25 h-25 flex items-center justify-center">
                <Image
                  src="/pixil-frame-0 (9).png"
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
                <p className="text-sm font-fun text-egg-yolkDark">
                  Cheaper, Better, More Together
                </p>
              </div>
            </Link>
            <div className="flex items-center space-x-3">
              <Link
                href="/"
                className="bg-egg-yolk hover:bg-egg-yolkDark text-egg-pixel-black font-pixel font-semibold px-4 py-2 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200 hover:shadow-pixel-lg"
              >
                BROWSE EGGS
              </Link>
              <Link
                href="/add"
                className="bg-egg-white hover:bg-egg-yolkLight text-egg-pixel-black font-pixel font-medium px-4 py-2 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200"
              >
                ADD EGGS
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-egg-white/90 backdrop-blur-sm rounded-none shadow-pixel border-3 border-egg-yolk">
          <div className="flex h-[600px]">
            {/* Conversations List */}
            <div className="w-1/3 border-r-2 border-egg-yolk">
              <div className="p-4 border-b-2 border-egg-yolk">
                <h2 className="text-xl font-pixel font-bold text-egg-pixel-black">
                  MESSAGES
                </h2>
              </div>
              <div className="overflow-y-auto h-full">
                {loading ? (
                  <div className="p-4 text-center">
                    <div className="animate-bounce">
                      <Image
                        src="/pixil-frame-0 (9).png"
                        alt="Loading"
                        width={40}
                        height={40}
                        className="w-10 h-10 object-contain mx-auto"
                      />
                    </div>
                    <p className="font-fun text-egg-pixel-black mt-2">Loading conversations...</p>
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="p-4 text-center">
                    <Image
                      src="/pixil-frame-0 (9).png"
                      alt="No messages"
                      width={60}
                      height={60}
                      className="w-15 h-15 object-contain mx-auto mb-3"
                    />
                    <p className="font-fun text-egg-pixel-black">No conversations yet!</p>
                    <p className="font-fun text-egg-yolkDark text-sm mt-1">
                      Start by browsing eggs and cracking some deals!
                    </p>
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => selectConversation(conversation)}
                      className={`p-4 border-b border-egg-yolkLight cursor-pointer hover:bg-egg-yolkLight/30 transition-colors ${
                        selectedConversation?.id === conversation.id ? 'bg-egg-yolkLight/50' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-pixel font-semibold text-egg-pixel-black">
                          {getOtherUserName(conversation)}
                        </h3>
                        <span className="text-xs font-fun text-egg-yolkDark">
                          {formatDate(conversation.updated_at)}
                        </span>
                      </div>
                      <p className="font-fun text-sm text-egg-pixel-black mb-1">
                        {conversation.listing.name} • {conversation.listing.quantity} eggs
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-pixel rounded-none border ${
                          conversation.status === 'active' 
                            ? 'bg-egg-yolk/30 text-egg-pixel-black border-egg-yolk' 
                            : conversation.status === 'completed'
                            ? 'bg-green-100 text-green-800 border-green-300'
                            : 'bg-red-100 text-red-800 border-red-300'
                        }`}>
                          {conversation.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Conversation Header */}
                  <div className="p-4 border-b-2 border-egg-yolk bg-egg-yolkLight/30">
                    <h3 className="font-pixel font-semibold text-egg-pixel-black">
                      {getOtherUserName(selectedConversation)}
                    </h3>
                    <p className="font-fun text-sm text-egg-pixel-black">
                      {selectedConversation.listing.name} • {selectedConversation.listing.quantity} eggs
                    </p>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender_id === (currentUser?.id || currentUser?.name) ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-none border-2 ${
                            message.sender_id === (currentUser?.id || currentUser?.name)
                              ? 'bg-egg-yolk text-egg-pixel-black border-egg-pixel-black'
                              : 'bg-egg-white text-egg-pixel-black border-egg-pixel-black'
                          }`}
                        >
                          {message.photo_url && (
                            <div className="mb-2">
                              <img
                                src={message.photo_url}
                                alt="Message photo"
                                className="max-w-full h-auto rounded-none border border-egg-pixel-black"
                                style={{ maxHeight: '200px' }}
                              />
                            </div>
                          )}
                          {message.content && (
                            <p className="font-fun text-sm">{message.content}</p>
                          )}
                          <p className="text-xs opacity-70 mt-1">
                            {formatDate(message.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t-2 border-egg-yolk">
                    {selectedPhoto && (
                      <div className="mb-3 p-3 bg-egg-yolkLight/50 border-2 border-egg-yolk rounded-none">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <img
                              src={URL.createObjectURL(selectedPhoto)}
                              alt="Selected photo"
                              className="w-12 h-12 object-cover rounded-none border border-egg-pixel-black"
                            />
                            <span className="font-fun text-sm text-egg-pixel-black">
                              {selectedPhoto.name}
                            </span>
                          </div>
                          <button
                            onClick={() => setSelectedPhoto(null)}
                            className="text-egg-pixel-black hover:text-red-600 font-pixel"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="flex space-x-2">
                      <label className="cursor-pointer bg-egg-white hover:bg-egg-yolkLight/30 text-egg-pixel-black font-pixel font-semibold px-3 py-2 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200 hover:shadow-pixel-lg flex items-center">
                        📷
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoSelect}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border-2 border-egg-pixel-black rounded-none bg-egg-white font-fun focus:outline-none focus:ring-2 focus:ring-egg-yolk"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={(!newMessage.trim() && !selectedPhoto) || uploadingPhoto}
                        className="bg-egg-yolk hover:bg-egg-yolkDark disabled:bg-egg-pixel-gray text-egg-pixel-black font-pixel font-semibold px-4 py-2 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200 hover:shadow-pixel-lg disabled:cursor-not-allowed"
                      >
                        {uploadingPhoto ? 'SENDING...' : 'SEND'}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <Image
                      src="/pixil-frame-0 (9).png"
                      alt="Select conversation"
                      width={80}
                      height={80}
                      className="w-20 h-20 object-contain mx-auto mb-4"
                    />
                    <p className="font-fun text-egg-pixel-black">
                      Select a conversation to start messaging!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 