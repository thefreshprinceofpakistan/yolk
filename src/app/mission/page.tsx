'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Mission() {
  const [currentEggFrame, setCurrentEggFrame] = useState(0);

  // Array of egg frames to alternate between
  const eggFrames = [
    '/pixil-frame-0 (9).png',        // Uncracked egg
    '/pixil-frame-0 (10).png'        // New egg image
  ];

  // Cycle through egg frames every 4000ms (4 seconds) to switch on second bounce
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEggFrame(prev => (prev + 1) % eggFrames.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [eggFrames.length]);
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#B6D0E2' }}>
      {/* Header */}
      <header className="bg-egg-white/90 backdrop-blur-sm border-b-3 border-egg-yolk shadow-pixel">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div>
                <Image
                  src="/pixil-frame-0 (5)-trimmed.png"
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
        <div className="bg-white rounded-none p-8 shadow-pixel-lg border-4 border-egg-pixel-black">
          {/* Mission Statement */}
          <div className="text-center mb-12">
            <div className="flex justify-center items-center space-x-4 mb-6 mt-8">
              <Image
                src={eggFrames[currentEggFrame]}
                alt="Eggconomy Mission"
                width={100}
                height={100}
                className="w-25 h-25 object-contain animate-roll-in-center translate-y-2"
              />
              <Image
                src="/pixil-frame-0 (16).png"
                alt="Tomato"
                width={100}
                height={100}
                className="w-25 h-25 object-contain animate-roll-in-left"
              />
              <Image
                src="/pixil-frame-0 (17).png"
                alt="Bread"
                width={100}
                height={100}
                className="w-25 h-25 object-contain animate-roll-in-right"
              />
              <Image
                src="/pixil-frame-0 (19).png"
                alt="New Food Item"
                width={100}
                height={100}
                className="w-25 h-25 object-contain animate-roll-in-right"
              />
            </div>
            <h1 className="text-4xl font-pixel font-bold text-egg-pixel-black mb-6">
              HATCHING INTO COMMUNITY
            </h1>
            <h2 className="text-2xl font-pixel font-semibold text-egg-pixel-black mb-8">
              BYPASSING CORPORATIONS
            </h2>
          </div>

          {/* The Egg Metaphor - NEW SECTION */}
          <div className="bg-white p-6 border-4 border-egg-pixel-black rounded-none mb-8 shadow-pixel">
            <h3 className="text-2xl font-pixel font-bold text-egg-pixel-black mb-4 text-center">
              WHY WE CALL OUR TRADES &quot;<em>EGGS</em>&quot;
            </h3>
            <div className="space-y-4 font-fun text-egg-pixel-black leading-relaxed">
              <p>
                Eggs are our symbol because they represent the simple beauty of sharing. 
                They&apos;re humble, they&apos;re honest, and they&apos;re something everyone understands. 
                An egg is more than just food; it&apos;s a promise of life, a symbol of hope, 
                and the perfect metaphor for what we&apos;re building together.
              </p>
              <p>
                When you share an egg, you&apos;re not just sharing food. You&apos;re sharing trust. 
                You&apos;re saying, &quot;I have something you need, and I believe you have something I need.&quot; 
                It&apos;s the oldest form of human connection, and it&apos;s how communities have survived 
                for thousands of years.
              </p>
              <p>
                In a world where corporations control our food and our relationships, 
                eggs remind us that the most powerful exchanges happen between neighbors, 
                not between strangers and faceless companies.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white p-6 border-4 border-egg-pixel-black rounded-none shadow-pixel">
              <div className="flex items-center space-x-3 mb-3">
                <Image
                  src="/Adobe Express - file (5).png"
                  alt="Community"
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                />
                <h3 className="text-xl font-pixel font-bold text-egg-pixel-black">
                  COMMUNITY FIRST
                </h3>
              </div>
              <p className="font-fun text-egg-pixel-black">
                We believe in the power of neighbors helping neighbors. 
                No middlemen, no corporate profits, just people sharing what they have.
              </p>
            </div>

            <div className="bg-white p-6 border-4 border-egg-pixel-black rounded-none shadow-pixel">
              <div className="flex items-center space-x-3 mb-3">
                <Image
                  src="/Adobe Express - file (4).png"
                  alt="Sustainable"
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                />
                <h3 className="text-xl font-pixel font-bold text-egg-pixel-black">
                  SUSTAINABLE LIVING
                </h3>
              </div>
              <p className="font-fun text-egg-pixel-black">
                Local resources shared within communities. 
                Reducing waste and building resilient, self-sufficient neighborhoods.
              </p>
            </div>

            <div className="bg-white p-6 border-4 border-egg-pixel-black rounded-none shadow-pixel">
              <div className="flex items-center space-x-3 mb-3">
                <Image
                  src="/Adobe Express - file (1).png"
                  alt="Connection"
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                />
                <h3 className="text-xl font-pixel font-bold text-egg-pixel-black">
                  HUMAN CONNECTION
                </h3>
              </div>
              <p className="font-fun text-egg-pixel-black">
                Real people, real conversations, real relationships. 
                Building trust through simple exchanges.
              </p>
            </div>

            <div className="bg-white p-6 border-4 border-egg-pixel-black rounded-none shadow-pixel">
              <div className="flex items-center space-x-3 mb-3">
                <Image
                  src="/pixil-frame-0 (7).png"
                  alt="Empowerment"
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                />
                <h3 className="text-xl font-pixel font-bold text-egg-pixel-black">
                  EMPOWERMENT
                </h3>
              </div>
              <p className="font-fun text-egg-pixel-black">
                Take control of your food sources. 
                No more dependency on corporate grocery chains.
              </p>
            </div>
          </div>

          {/* How We Started */}
          <div className="bg-white p-6 border-4 border-egg-pixel-black rounded-none mb-8 shadow-pixel">
            <h3 className="text-2xl font-pixel font-bold text-egg-pixel-black mb-4 text-center">
              HOW WE STARTED
            </h3>
            <div className="space-y-4 font-fun text-egg-pixel-black">
              <p>
                Eggs became our symbol because they represent something universal, 
                everyone needs food, and eggs are accessible to everyone. 
                They&apos;re simple, they&apos;re essential, and they bring people together.
              </p>
              <p>
                But we noticed something troubling, people were struggling to afford 
                basic foods like eggs from the store. Prices kept rising, but wages 
                weren&apos;t keeping up. Something as simple as a dozen eggs was becoming 
                a luxury for many families.
              </p>
              <p>
                We wanted to start something that honors that simplicity. 
                Something that connects neighbors through the most basic human need, 
                sharing food. No corporate middlemen, no complicated systems, 
                just people helping people with what they have.
              </p>
              <p>
                That&apos;s why we chose eggs. They&apos;re humble, they&apos;re honest, 
                and they&apos;re the perfect starting point for building community. 
                When someone has extra eggs, they can share. When someone needs eggs, 
                they can find them. Simple. Human. Fair.
              </p>
            </div>
          </div>

          {/* What We're Building */}
          <div className="bg-white p-6 border-4 border-egg-pixel-black rounded-none mb-8 shadow-pixel">
            <h3 className="text-2xl font-pixel font-bold text-egg-pixel-black mb-4 text-center">
              WHAT WE&apos;RE BUILDING
            </h3>
            <div className="space-y-4 font-fun text-egg-pixel-black">
              <p>
                <strong>Eggconomy</strong> is more than just a marketplace for eggs. 
                It&apos;s a movement toward community self-reliance and human connection.
              </p>
              <p>
                We&apos;re creating a world where:
              </p>
              <ul className="space-y-2 ml-6">
                <li>• Neighbors know each other by name</li>
                <li>• Food comes from local sources, not corporate warehouses</li>
                <li>• Money stays in the community</li>
                <li>• People share what they have, not what they can sell</li>
                <li>• Technology connects us, not isolates us</li>
              </ul>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center space-y-6">
            <div className="bg-white p-8 border-4 border-egg-pixel-black rounded-none shadow-pixel">
              <h3 className="text-2xl font-pixel font-bold text-egg-pixel-black mb-4">
                JOIN THE REVOLUTION
              </h3>
              <p className="font-fun text-egg-pixel-black mb-6 text-lg">
                Start small. Share a dozen eggs. Meet a neighbor. 
                Build something bigger than yourself.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="bg-egg-yolk hover:bg-egg-yolkDark text-egg-pixel-black font-pixel font-semibold px-8 py-4 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200 hover:shadow-pixel-lg text-lg"
                >
                  BROWSE THE FEED
                </Link>
                <Link
                  href="/add"
                  className="bg-egg-white hover:bg-egg-yolkLight text-egg-pixel-black font-pixel font-semibold px-8 py-4 rounded-none border-2 border-egg-pixel-black shadow-pixel transition-all duration-200 hover:shadow-pixel-lg text-lg"
                >
                  OFFER A TRADE
                </Link>
              </div>
            </div>
          </div>

          {/* Footer Quote */}
          <div className="text-center mt-12 pt-8 border-t-4 border-egg-pixel-black">
            <p className="font-pixel text-lg text-egg-pixel-black italic">
              &quot;The best eggs come from happy hens, and the best communities come from happy neighbors.&quot;
            </p>
            <p className="font-fun text-egg-yolkDark mt-2">
              : The Eggconomy Community
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 