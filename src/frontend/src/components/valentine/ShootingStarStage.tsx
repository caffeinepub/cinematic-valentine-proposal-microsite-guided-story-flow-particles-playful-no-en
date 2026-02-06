import { useEffect } from 'react';

interface ShootingStarStageProps {
  onComplete: () => void;
}

export function ShootingStarStage({ onComplete }: ShootingStarStageProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="max-w-4xl mx-auto text-center px-6 relative">
      <div className="glassmorphism-strong rounded-3xl p-8 md:p-12 card-glow animate-float-breath">
        <div className="min-h-[300px] flex items-center justify-center">
          <p className="font-romantic text-3xl md:text-5xl text-glow animate-fade-in">
            Make a wish… I already did.
          </p>
        </div>
      </div>

      {/* Shooting star */}
      <div className="absolute top-1/4 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div
          className="absolute w-2 h-2 rounded-full bg-white animate-shooting-star"
          style={{
            boxShadow: '0 0 20px 4px rgba(255, 255, 255, 0.8), 0 0 40px 8px rgba(255, 215, 0, 0.6)',
            animation: 'shooting-star 2s ease-out forwards',
          }}
        />
      </div>

      <style>{`
        @keyframes shooting-star {
          0% {
            transform: translate(-100px, -100px);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translate(calc(100vw + 100px), calc(50vh + 100px));
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
