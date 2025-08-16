'use client';

import { useParallaxBackground } from '@/hooks/use-parallax-background';

export function ParallaxProvider({ children }: { children: React.ReactNode }) {
  useParallaxBackground();
  return <>{children}</>;
}
