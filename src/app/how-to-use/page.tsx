'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HowToUse() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Eggconomy! 🥚",
      description: "A community marketplace for sharing fresh eggs and building connections.",
      content: (
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Image
              src="/pixil-frame-0 (9).png"
              alt="Eggconomy"
              width={96}
              height={96}
              className="w-24 h-24 object-contain animate-bounce"
            />
          </div>
          <p className="font-fun text-lg">
            Whether you have extra eggs to share or need fresh eggs for your family, 
            Eggconomy connects neighbors through the simple joy of fresh eggs!
          </p>
        </div>
      )
    },
    {
      title: "Browse & Search Listings",
      description: "Find eggs near you using our powerful search and filter tools.",
      content: (
        <div className="space-y-4">
          <div className="bg-egg-white/80 p-4 border-2 border-egg-yolk rounded-none">
            <h4 className="font-pixel font-semibold mb-2">🔍 Search Features:</h4>
            <ul className="font-fun space-y-1 text-sm">
              <li>• Search by location (e.g., "Berea, KY")</li>
              <li>• Search by items you want to trade (e.g., "vegetables", "bread")</li>
              <li>• Filter by exchange type: Gift, Barter, or Cash</li>
              <li>• See how many eggs are available</li>
            </ul>
          </div>
          <div className="bg-egg-white/80 p-4 border-2 border-egg-yolk rounded-none">
            <h4 className="font-pixel font-semibold mb-2">📍 Location Filter:</h4>
            <p className="font-fun text-sm">
              Use the location dropdown to find eggs in your area. 
              Perfect for finding local connections!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Exchange Types Explained",
      description: "Learn about the different ways to exchange eggs.",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-egg-white/80 p-4 border-2 border-egg-yolk rounded-none text-center">
              <div className="flex justify-center mb-2">
                <Image
                  src="/pixil-frame-0 (6).png"
                  alt="Gift"
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <h4 className="font-pixel font-semibold text-egg-yolkDark">GIFT</h4>
              <p className="font-fun text-sm">Free eggs! Just pick them up.</p>
            </div>
            <div className="bg-egg-white/80 p-4 border-2 border-egg-yolk rounded-none text-center">
              <div className="flex justify-center mb-2">
                <Image
                  src="/Adobe Express - file (1).png"
                  alt="Barter"
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <h4 className="font-pixel font-semibold text-egg-yolkDark">BARTER</h4>
              <p className="font-fun text-sm">Trade eggs for other goods or services.</p>
            </div>
            <div className="bg-egg-white/80 p-4 border-2 border-egg-yolk rounded-none text-center">
              <div className="flex justify-center mb-2">
                <Image
                  src="/pixil-frame-0 (7).png"
                  alt="Cash"
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <h4 className="font-pixel font-semibold text-egg-yolkDark">CASH</h4>
              <p className="font-fun text-sm">Pay money for fresh eggs.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Making a Deal",
      description: "How to connect with egg providers and arrange pickups.",
      content: (
        <div className="space-y-4">
          <div className="bg-egg-white/80 p-4 border-2 border-egg-yolk rounded-none">
            <h4 className="font-pixel font-semibold mb-2">Step 1: Find Eggs</h4>
            <p className="font-fun text-sm mb-3">
              Browse listings and find eggs that work for you. Check the quantity, 
              location, and exchange type.
            </p>
          </div>
          <div className="bg-egg-white/80 p-4 border-2 border-egg-yolk rounded-none">
            <h4 className="font-pixel font-semibold mb-2">Step 2: Click "CRACK A DEAL!"</h4>
            <p className="font-fun text-sm mb-3">
              This opens a detailed view with contact information and payment methods.
            </p>
          </div>
          <div className="bg-egg-white/80 p-4 border-2 border-egg-yolk rounded-none">
            <h4 className="font-pixel font-semibold mb-2">Step 3: Send a Message</h4>
            <p className="font-fun text-sm mb-3">
              Use the message form to introduce yourself and arrange pickup details.
            </p>
          </div>
          <div className="bg-egg-white/80 p-4 border-2 border-egg-yolk rounded-none">
            <h4 className="font-pixel font-semibold mb-2">Step 4: Meet & Exchange</h4>
            <p className="font-fun text-sm">
              Meet in person to complete the exchange. Bring cash, trade items, 
              or just your gratitude!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Sharing Your Eggs",
      description: "How to list your own eggs for the community.",
      content: (
        <div className="space-y-4">
          <div className="bg-egg-white/80 p-4 border-2 border-egg-yolk rounded-none">
            <h4 className="font-pixel font-semibold mb-2">Step 1: Sign In</h4>
            <p className="font-fun text-sm mb-3">
              Click "SIGN IN" in the top right. You can use any name and password 
              to get started - no email required!
            </p>
          </div>
          <div className="bg-egg-white/80 p-4 border-2 border-egg-yolk rounded-none">
            <h4 className="font-pixel font-semibold mb-2">Step 2: Add Your Eggs</h4>
            <p className="font-fun text-sm mb-3">
              Click "ADD EGGS" and fill out the form with:
            </p>
            <ul className="font-fun text-sm space-y-1 ml-4">
              <li>• How many eggs you have</li>
              <li>• What you want in exchange (gift, barter, or cash)</li>
              <li>• Your location</li>
              <li>• Any special notes</li>
            </ul>
          </div>
          <div className="bg-egg-white/80 p-4 border-2 border-egg-yolk rounded-none">
            <h4 className="font-pixel font-semibold mb-2">Step 3: Respond to Messages</h4>
            <p className="font-fun text-sm">
              When someone is interested in your eggs, they'll send you a message. 
              Reply to arrange pickup details!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Safety & Community Guidelines",
      description: "Tips for safe and positive exchanges.",
      content: (
        <div className="space-y-4">
          <div className="bg-green-100 p-4 border-2 border-green-500 rounded-none">
            <h4 className="font-pixel font-semibold text-green-800 mb-2">✅ Safety Tips:</h4>
            <ul className="font-fun text-sm space-y-1 text-green-800">
              <li>• Meet in public places or well-lit areas</li>
              <li>• Bring a friend if meeting someone new</li>
              <li>• Trust your instincts - if something feels off, don't proceed</li>
              <li>• Exchange during daylight hours when possible</li>
            </ul>
          </div>
          <div className="bg-blue-100 p-4 border-2 border-blue-500 rounded-none">
            <h4 className="font-pixel font-semibold text-blue-800 mb-2">🤝 Community Guidelines:</h4>
            <ul className="font-fun text-sm space-y-1 text-blue-800">
              <li>• Be honest about egg quality and quantity</li>
              <li>• Communicate clearly about pickup times and locations</li>
              <li>• Be respectful and patient with other community members</li>
              <li>• Report any suspicious activity</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFCF08]">
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
            <Link 
              href="/"
              className="bg-egg-pixel-gray hover:bg-egg-pixel-grayDark text-egg-pixel-black font-pixel font-semibold px-4 py-2 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200"
            >
              ← BACK TO HOME
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-egg-white/90 backdrop-blur-sm rounded-none p-8 shadow-pixel border-3 border-egg-yolk">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="font-pixel text-sm text-egg-pixel-black">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="font-pixel text-sm text-egg-pixel-black">
                {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-egg-pixel-gray h-3 border-2 border-egg-pixel-black">
              <div 
                className="bg-egg-yolk h-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Current Step Content */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-pixel font-bold text-egg-pixel-black mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-egg-pixel-black font-fun text-lg mb-6">
              {steps[currentStep].description}
            </p>
            <div className="text-left">
              {steps[currentStep].content}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-none font-pixel font-semibold border-2 border-egg-pixel-black shadow-pixel transition-all duration-200 ${
                currentStep === 0
                  ? 'bg-egg-pixel-gray text-egg-pixel-black cursor-not-allowed'
                  : 'bg-egg-white hover:bg-egg-yolkLight text-egg-pixel-black hover:shadow-pixel-lg'
              }`}
            >
              ← PREVIOUS
            </button>

            {currentStep === steps.length - 1 ? (
              <Link
                href="/"
                className="bg-egg-yolk hover:bg-egg-yolkDark text-egg-pixel-black font-pixel font-semibold px-8 py-3 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200 hover:shadow-pixel-lg"
              >
                GET STARTED! 🥚
              </Link>
            ) : (
              <button
                onClick={nextStep}
                className="bg-egg-yolk hover:bg-egg-yolkDark text-egg-pixel-black font-pixel font-semibold px-6 py-3 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200 hover:shadow-pixel-lg"
              >
                NEXT →
              </button>
            )}
          </div>

          {/* Skip to Home */}
          <div className="text-center mt-8">
            <Link 
              href="/"
              className="text-egg-yolkDark hover:text-egg-yolk font-pixel font-medium"
            >
              Skip tutorial and go to marketplace
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
} 