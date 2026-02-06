import { useEffect, useRef } from 'react';

interface CursorSparkleTrailProps {
  isReducedMotion: boolean;
}

interface Sparkle {
  x: number;
  y: number;
  size: number;
  life: number;
  maxLife: number;
}

export function CursorSparkleTrail({ isReducedMotion }: CursorSparkleTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparklesRef = useRef<Sparkle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const lastSparkleTime = useRef(0);

  useEffect(() => {
    if (isReducedMotion) return;

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

    const handlePointerMove = (e: PointerEvent) => {
      const now = Date.now();
      if (now - lastSparkleTime.current < 50) return;
      lastSparkleTime.current = now;

      sparklesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 4 + 2,
        life: 0,
        maxLife: 30,
      });

      if (sparklesRef.current.length > 20) {
        sparklesRef.current.shift();
      }
    };

    window.addEventListener('pointermove', handlePointerMove);

    const sparkleImage = new Image();
    sparkleImage.src = '/assets/generated/sparkle-sprite.dim_512x512.png';

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparklesRef.current = sparklesRef.current.filter((sparkle) => {
        sparkle.life++;
        const progress = sparkle.life / sparkle.maxLife;
        const opacity = 1 - progress;

        if (opacity <= 0) return false;

        ctx.save();
        ctx.globalAlpha = opacity;

        if (sparkleImage.complete) {
          ctx.drawImage(
            sparkleImage,
            sparkle.x - sparkle.size / 2,
            sparkle.y - sparkle.size / 2,
            sparkle.size,
            sparkle.size
          );
        } else {
          // Fallback sparkle
          ctx.fillStyle = '#ffd700';
          ctx.beginPath();
          ctx.arc(sparkle.x, sparkle.y, sparkle.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
        return true;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('pointermove', handlePointerMove);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isReducedMotion]);

  if (isReducedMotion) return null;

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[100]" />;
}
