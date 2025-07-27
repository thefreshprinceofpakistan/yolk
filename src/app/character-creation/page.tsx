'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Character {
  animal: 'cow' | 'pig' | 'chick';
  accessory: 'none' | 'bow' | 'moustache' | 'hat';
  name: string;
}

export default function CharacterCreation() {
  const [character, setCharacter] = useState<Character>({
    animal: 'cow',
    accessory: 'none',
    name: ''
  });
  const [currentUser, setCurrentUser] = useState<{ name: string; isLoggedIn: boolean } | null>(null);

  useEffect(() => {
    // Get current user from localStorage
    const user = JSON.parse(localStorage.getItem('userSession') || 'null');
    setCurrentUser(user);
    
    if (user) {
      setCharacter(prev => ({ ...prev, name: user.name }));
      
      // Load existing character data if available
      const existingCharacter = localStorage.getItem('userCharacter');
      if (existingCharacter) {
        try {
          const savedCharacter = JSON.parse(existingCharacter);
          setCharacter(savedCharacter);
        } catch (error) {
          console.error('Error loading character:', error);
        }
      }
    }
  }, []);

  const animals = [
    { id: 'cow', name: 'Cow', image: '/pixil-frame-0 (11).png' },
    { id: 'pig', name: 'Pig', image: '/pixil-frame-0 (14).png' },
    { id: 'chick', name: 'Chick', image: '/pixil-frame-0 (13).png' }
  ];

  const accessories = [
    { id: 'none', name: 'None', image: null },
    { id: 'bow', name: 'Bow', image: '/pixil-frame-0 (15).png' },
    { id: 'moustache', name: 'Moustache', image: '/Adobe Express - file (7).png' },
    { id: 'hat', name: 'Hat', image: '/Adobe Express - file (8).png' }
  ];

  const handleSave = () => {
    if (!character.name.trim()) {
      alert('Please enter your character name!');
      return;
    }

    // Save character to localStorage
    localStorage.setItem('userCharacter', JSON.stringify(character));
    
    // Update user session with character info
    if (currentUser) {
      const updatedUser = { ...currentUser, character };
      localStorage.setItem('userSession', JSON.stringify(updatedUser));
    }

    // Redirect to home page
    window.location.href = '/';
  };

  const handleSkip = () => {
    // Create a default character with user's name
    const defaultCharacter: Character = {
      animal: 'cow',
      accessory: 'none',
      name: currentUser?.name || 'User'
    };

    // Save default character to localStorage
    localStorage.setItem('userCharacter', JSON.stringify(defaultCharacter));
    
    // Update user session with default character info
    if (currentUser) {
      const updatedUser = { ...currentUser, character: defaultCharacter };
      localStorage.setItem('userSession', JSON.stringify(updatedUser));
    }

    // Redirect to home page
    window.location.href = '/';
  };

  if (!currentUser?.isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#ff9e03] flex items-center justify-center">
        <div className="bg-egg-white/90 backdrop-blur-sm rounded-none p-8 shadow-pixel border-3 border-egg-yolk text-center max-w-md mx-4">
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
          <p className="text-egg-pixel-black font-fun mb-6">
            Please sign in to create your character!
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
            <div className="text-egg-pixel-black font-pixel font-semibold">
              CREATE YOUR CHARACTER
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-egg-white/90 backdrop-blur-sm rounded-none p-8 shadow-pixel border-3 border-egg-yolk">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-pixel font-bold text-egg-pixel-black mb-4">
              DESIGN YOUR CHARACTER
            </h2>
            <p className="text-egg-pixel-black font-fun text-lg">
              Choose your favorite farm animal and add some personality!
            </p>
          </div>

          {/* Character Preview */}
          <div className="text-center mb-8">
            <div className="bg-egg-yolkLight/50 p-8 border-2 border-egg-yolk rounded-none inline-block">
              <div className="relative w-32 h-32 mx-auto mb-4">
                {/* Animal */}
                <Image
                  src={animals.find(a => a.id === character.animal)?.image || '/pixil-frame-0 (9).png'}
                  alt={character.animal}
                  width={128}
                  height={128}
                  className="w-32 h-32 object-contain"
                />
                {/* Accessory */}
                {character.accessory !== 'none' && (
                  <div className={`absolute top-0 left-0 w-full h-full flex items-center justify-center ${
                    character.accessory === 'moustache' ? 
                      (character.animal === 'chick' ? 'translate-y-2' : 'translate-y-4') : 
                    character.accessory === 'hat' ? '-translate-y-8' : 
                    character.accessory === 'bow' ? '-translate-y-8' : ''
                  }`}>
                    <Image
                      src={accessories.find(a => a.id === character.accessory)?.image || ''}
                      alt={character.accessory}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                )}
              </div>
              <h3 className="font-pixel font-bold text-egg-pixel-black text-xl">
                {character.name || 'Your Character'}
              </h3>
            </div>
          </div>

          {/* Character Name */}
          <div className="mb-8">
            <label htmlFor="characterName" className="block text-sm font-pixel font-semibold text-egg-pixel-black mb-2">
              CHARACTER NAME *
            </label>
            <input
              type="text"
              id="characterName"
              value={character.name}
              onChange={(e) => setCharacter(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 border-3 border-egg-pixel-black rounded-none bg-egg-white font-fun shadow-pixel focus:outline-none focus:ring-2 focus:ring-egg-yolk text-egg-pixel-black"
              placeholder="e.g., Farmer Sarah, Egg Master Mike"
            />
          </div>

          {/* Animal Selection */}
          <div className="mb-8">
            <h3 className="text-xl font-pixel font-bold text-egg-pixel-black mb-4 text-center">
              CHOOSE YOUR ANIMAL
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {animals.map((animal) => (
                <button
                  key={animal.id}
                  onClick={() => setCharacter(prev => ({ ...prev, animal: animal.id as 'cow' | 'pig' | 'chick' }))}
                  className={`p-4 border-3 rounded-none transition-all duration-200 ${
                    character.animal === animal.id
                      ? 'border-egg-yolk bg-egg-yolkLight/50 shadow-pixel-lg scale-105'
                      : 'border-egg-pixel-black bg-egg-white hover:bg-egg-yolkLight/30 shadow-pixel'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Image
                      src={animal.image}
                      alt={animal.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-contain"
                    />
                    <span className="font-pixel font-semibold text-egg-pixel-black">
                      {animal.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Accessory Selection */}
          <div className="mb-8">
            <h3 className="text-xl font-pixel font-bold text-egg-pixel-black mb-4 text-center">
              ADD AN ACCESSORY
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {accessories.map((accessory) => (
                <button
                  key={accessory.id}
                  onClick={() => setCharacter(prev => ({ ...prev, accessory: accessory.id as 'none' | 'bow' | 'moustache' | 'hat' }))}
                  className={`p-4 border-3 rounded-none transition-all duration-200 ${
                    character.accessory === accessory.id
                      ? 'border-egg-yolk bg-egg-yolkLight/50 shadow-pixel-lg scale-105'
                      : 'border-egg-pixel-black bg-egg-white hover:bg-egg-yolkLight/30 shadow-pixel'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    {accessory.image ? (
                      <Image
                        src={accessory.image}
                        alt={accessory.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center">
                        <span className="text-egg-pixel-black font-pixel text-xs">—</span>
                      </div>
                    )}
                    <span className="font-pixel font-semibold text-egg-pixel-black text-sm">
                      {accessory.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleSkip}
              className="bg-egg-pixel-gray hover:bg-egg-pixel-grayDark text-egg-pixel-black font-pixel font-semibold px-6 py-3 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200 text-center"
            >
              SKIP FOR NOW
            </button>
            <button
              onClick={handleSave}
              className="bg-egg-yolk hover:bg-egg-yolkDark text-egg-pixel-black font-pixel font-semibold px-8 py-3 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200 hover:shadow-pixel-lg"
            >
              SAVE CHARACTER
            </button>
          </div>

          <div className="text-center mt-6">
            <p className="text-egg-pixel-black font-fun text-sm">
              You can always change your character later in your profile!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 