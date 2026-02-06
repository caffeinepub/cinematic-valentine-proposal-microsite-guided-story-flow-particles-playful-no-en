import { ReactNode, useEffect, useState } from 'react';

interface StageTransitionProps {
  children: ReactNode;
  currentStage: string;
}

export function StageTransition({ children, currentStage }: StageTransitionProps) {
  const [displayedStage, setDisplayedStage] = useState(currentStage);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (currentStage !== displayedStage) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setDisplayedStage(currentStage);
        setIsTransitioning(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [currentStage, displayedStage]);

  return (
    <div
      className={`w-full transition-opacity duration-[600ms] cinematic-ease-slow ${
        isTransitioning ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {children}
    </div>
  );
}
