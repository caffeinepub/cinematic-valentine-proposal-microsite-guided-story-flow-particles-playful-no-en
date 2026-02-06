import { useState, useEffect } from 'react';
import { Heart3DScene } from './Heart3DScene';

interface HeartYesTransitionStageProps {
  onComplete: () => void;
  isReducedMotion: boolean;
}

export function HeartYesTransitionStage({ onComplete, isReducedMotion }: HeartYesTransitionStageProps) {
  const [zoomProgress, setZoomProgress] = useState(0);
  const [textOpacity, setTextOpacity] = useState(0);
  const [sceneOpacity, setSceneOpacity] = useState(1);

  useEffect(() => {
    const duration = isReducedMotion ? 1500 : 3500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-in-out progress
      const easedProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      setZoomProgress(easedProgress);

      // Fade in text after 30% progress
      if (progress > 0.3) {
        const textProgress = Math.min((progress - 0.3) / 0.3, 1);
        setTextOpacity(textProgress);
      }

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
            setSceneOpacity(1 - fadeProgress);
            
            if (fadeProgress < 1) {
              requestAnimationFrame(fadeOut);
            } else {
              onComplete();
            }
          };
          
          fadeOut();
        }, 800);
      }
    };

    animate();
  }, [onComplete, isReducedMotion]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-rose-950/95 via-pink-950/95 to-red-950/95"
      style={{ opacity: sceneOpacity }}
    >
      <div className="absolute inset-0">
        <Heart3DScene zoomProgress={zoomProgress} isReducedMotion={isReducedMotion} />
      </div>
      
      <div
        className="relative z-10 text-center px-6 max-w-3xl"
        style={{ opacity: textOpacity }}
      >
        <h2 className="font-romantic text-4xl md:text-6xl lg:text-7xl text-white text-glow-heart">
          Getting more deeper in my heart
        </h2>
      </div>
    </div>
  );
}
