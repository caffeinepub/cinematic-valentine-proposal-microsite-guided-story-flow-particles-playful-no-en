import { useEffect, useRef } from 'react';

interface ParticlesLayerProps {
  isReducedMotion: boolean;
  currentStage: string;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  blur: number;
}

export function ParticlesLayer({ isReducedMotion, currentStage }: ParticlesLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);

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

    // Initialize particles with depth
    const particleCount = Math.min(30, Math.floor(window.innerWidth / 40));
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 20 + 10,
      speedY: Math.random() * 0.5 + 0.2,
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.2,
      blur: Math.random() * 3 + 1,
    }));

    const heartImage = new Image();
    heartImage.src = '/assets/generated/heart-sprite.dim_512x512.png';

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        particle.y += particle.speedY;
        particle.x += particle.speedX;

        if (particle.y > canvas.height + particle.size) {
          particle.y = -particle.size;
          particle.x = Math.random() * canvas.width;
        }

        if (particle.x < -particle.size || particle.x > canvas.width + particle.size) {
          particle.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.filter = `blur(${particle.blur}px)`;

        if (heartImage.complete) {
          ctx.drawImage(
            heartImage,
            particle.x - particle.size / 2,
            particle.y - particle.size / 2,
            particle.size,
            particle.size
          );
        } else {
          // Fallback heart shape
          ctx.fillStyle = '#ff6b9d';
          ctx.beginPath();
          const x = particle.x;
          const y = particle.y;
          const size = particle.size / 2;
          ctx.moveTo(x, y + size / 4);
          ctx.bezierCurveTo(x, y, x - size / 2, y - size / 2, x - size, y + size / 4);
          ctx.bezierCurveTo(x - size, y + size, x, y + size * 1.5, x, y + size * 2);
          ctx.bezierCurveTo(x, y + size * 1.5, x + size, y + size, x + size, y + size / 4);
          ctx.bezierCurveTo(x + size / 2, y - size / 2, x, y, x, y + size / 4);
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isReducedMotion, currentStage]);

  if (isReducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ opacity: 0.6 }}
    />
  );
}
