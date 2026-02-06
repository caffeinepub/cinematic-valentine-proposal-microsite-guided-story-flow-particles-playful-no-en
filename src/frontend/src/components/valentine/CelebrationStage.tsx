import { useEffect, useRef, useState } from 'react';
import { LoveMeter } from './LoveMeter';
import { useAudioSystem } from '../../hooks/useAudioSystem';

interface CelebrationStageProps {
  onComplete: () => void;
}

interface Confetti {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  color: string;
  type: 'heart' | 'petal';
}

export function CelebrationStage({ onComplete }: CelebrationStageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const confettiRef = useRef<Confetti[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const [showLoveMeter, setShowLoveMeter] = useState(false);
  const { playHeartbeat } = useAudioSystem();

  useEffect(() => {
    playHeartbeat();
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initial burst
    const colors = ['#ff6b9d', '#ff8fab', '#ffa5ba', '#ffc0cb', '#ff1493'];
    for (let i = 0; i < 50; i++) {
      confettiRef.current.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15 - 5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        size: Math.random() * 15 + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: Math.random() > 0.5 ? 'heart' : 'petal',
      });
    }

    // Continuous falling
    const addContinuous = setInterval(() => {
      if (confettiRef.current.length < 100) {
        confettiRef.current.push({
          x: Math.random() * canvas.width,
          y: -20,
          vx: (Math.random() - 0.5) * 2,
          vy: Math.random() * 2 + 1,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 5,
          size: Math.random() * 12 + 8,
          color: colors[Math.floor(Math.random() * colors.length)],
          type: Math.random() > 0.5 ? 'heart' : 'petal',
        });
      }
    }, 200);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      confettiRef.current = confettiRef.current.filter((confetti) => {
        confetti.x += confetti.vx;
        confetti.y += confetti.vy;
        confetti.vy += 0.2; // gravity
        confetti.rotation += confetti.rotationSpeed;

        if (confetti.y > canvas.height + 50) return false;

        ctx.save();
        ctx.translate(confetti.x, confetti.y);
        ctx.rotate((confetti.rotation * Math.PI) / 180);
        ctx.fillStyle = confetti.color;

        if (confetti.type === 'heart') {
          // Draw heart
          const size = confetti.size / 2;
          ctx.beginPath();
          ctx.moveTo(0, size / 4);
          ctx.bezierCurveTo(0, 0, -size / 2, -size / 2, -size, size / 4);
          ctx.bezierCurveTo(-size, size, 0, size * 1.5, 0, size * 2);
          ctx.bezierCurveTo(0, size * 1.5, size, size, size, size / 4);
          ctx.bezierCurveTo(size / 2, -size / 2, 0, 0, 0, size / 4);
          ctx.fill();
        } else {
          // Draw petal
          ctx.beginPath();
          ctx.ellipse(0, 0, confetti.size / 2, confetti.size, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
        return true;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    setTimeout(() => setShowLoveMeter(true), 2000);
    setTimeout(onComplete, 8000);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      clearInterval(addContinuous);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [onComplete, playHeartbeat]);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[50]" />
      
      <div className="max-w-4xl mx-auto text-center px-6 relative z-[60]">
        <div className="glassmorphism-strong rounded-3xl p-8 md:p-12 card-glow animate-float-breath animate-pulse-glow">
          <div className="min-h-[300px] flex flex-col items-center justify-center space-y-8">
            <h2 className="font-romantic text-4xl md:text-6xl text-glow animate-scale-in">
              She Said YES! 💖
            </h2>
            
            {showLoveMeter && (
              <div className="w-full max-w-md animate-slide-up">
                <LoveMeter />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
