import { useEffect, useState } from 'react';

export function LoveMeter() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 3000;
    const steps = 60;
    const increment = 100 / steps;
    const interval = duration / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= 100) {
        setProgress(100);
        clearInterval(timer);
      } else {
        setProgress(current);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-3">
      <p className="font-elegant text-lg md:text-xl text-glow-soft">
        Love Level: 1000% and still increasing…
      </p>
      
      <div className="relative w-full h-6 rounded-full overflow-hidden glassmorphism">
        <div
          className="absolute inset-0 rounded-full transition-all duration-300 animate-pulse-glow"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, oklch(var(--romantic-pink)), oklch(var(--rose-gold)))',
            boxShadow: '0 0 20px oklch(var(--glow-primary) / 0.6)',
          }}
        />
      </div>
    </div>
  );
}
