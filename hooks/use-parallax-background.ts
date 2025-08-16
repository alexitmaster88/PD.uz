'use client';

import { useEffect } from 'react';

export function useParallaxBackground() {
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateBackground = () => {
      const scrolled = window.scrollY;
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = scrolled / pageHeight;
      
      // Vertical movement (slower and smoother)
      const translateY = -scrolled * 0.05; // 5% of scroll speed
      
      // Horizontal movement based on scroll progress
      const translateX = Math.sin(scrollProgress * Math.PI) * 20; // 20px maximum horizontal movement
      
      document.body.style.setProperty('--bg-translate-y', `${translateY}px`);
      document.body.style.setProperty('--bg-translate-x', `${translateX}px`);
      
      lastScrollY = scrolled;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateBackground();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial update
    updateBackground();

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
}
