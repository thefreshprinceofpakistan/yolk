'use client';

import { useState, useEffect } from 'react';

interface BouncingEggProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function BouncingEgg({ size = 'md', className = '' }: BouncingEggProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const images = [
    '/Adobe Express - file.png', // Raw egg
    '/download-removebg-preview.png' // Fried egg
  ];

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  useEffect(() => {
    const handleAnimation = () => {
      if (!isAnimating) {
        setIsAnimating(true);
        setCurrentImage(prev => (prev + 1) % images.length);
        
        // Reset animation state after animation completes
        setTimeout(() => {
          setIsAnimating(false);
        }, 600); // Match the bounce animation duration
      }
    };

    // Listen for animation events
    const element = document.querySelector('.bouncing-egg');
    if (element) {
      element.addEventListener('animationiteration', handleAnimation);
      return () => {
        element.removeEventListener('animationiteration', handleAnimation);
      };
    }
  }, [isAnimating, images.length]);

  return (
    <div className={`${sizeClasses[size]} ${className} bouncing-egg`}>
      <img
        src={images[currentImage]}
        alt="Bouncing egg"
        className="w-full h-full object-contain animate-bounce"
        style={{
          animationDuration: '1.2s',
          animationIterationCount: 'infinite'
        }}
      />
    </div>
  );
}
