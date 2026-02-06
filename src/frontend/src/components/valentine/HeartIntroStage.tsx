import { useState, useEffect } from 'react';
import { Heart3DScene } from './Heart3DScene';

interface HeartIntroStageProps {
  onComplete: () => void;
  isReducedMotion: boolean;
}

export function HeartIntroStage({ onComplete, isReducedMotion }: HeartIntroStageProps) {
  const [zoomProgress, setZoomProgress] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const duration = isReducedMotion ? 1500 : 3000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-in-out progress
      const easedProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      setZoomProgress(easedProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Start fade out
        setTimeout(() => {
          const fadeStart = Date.now();
          const fadeDuration = 600;
          
          const fadeOut = () => {
            const fadeElapsed = Date.now() - fadeStart;
            const fadeProgress = Math.min(fadeElapsed / fadeDuration, 1);
            setOpacity(1 - fadeProgress);
            
            if (fadeProgress < 1) {
              requestAnimationFrame(fadeOut);
            } else {
              onComplete();
            }
          };
          
          fadeOut();
        }, 500);
      }
    };

    animate();
  }, [onComplete, isReducedMotion]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-rose-950/95 via-pink-950/95 to-red-950/95"
      style={{ opacity }}
    >
      <div className="absolute inset-0">
        <Heart3DScene zoomProgress={zoomProgress} isReducedMotion={isReducedMotion} />
      </div>
    </div>
  );
}
