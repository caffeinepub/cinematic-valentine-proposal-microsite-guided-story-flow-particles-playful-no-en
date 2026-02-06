interface BackgroundLayersProps {
  currentStage: string;
}

export function BackgroundLayers({ currentStage }: BackgroundLayersProps) {
  const isDimmed = currentStage === 'star';
  const isEnding = currentStage === 'ending';

  return (
    <>
      {/* Animated gradient background */}
      <div
        className={`fixed inset-0 animate-gradient transition-opacity duration-1000 ${
          isEnding ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          background: `linear-gradient(135deg, 
            oklch(0.88 0.10 350) 0%, 
            oklch(0.75 0.14 25) 25%, 
            oklch(0.65 0.16 20) 50%, 
            oklch(0.55 0.18 15) 75%, 
            oklch(0.45 0.20 10) 100%)`,
        }}
      />

      {/* Rose background for ending */}
      {isEnding && (
        <div
          className="fixed inset-0 animate-fade-in"
          style={{
            backgroundImage: 'url(/assets/generated/rose-bg.dim_1920x1080.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      {/* Vignette overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/assets/generated/vignette-overlay.dim_1920x1080.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.4,
        }}
      />

      {/* Ambient glow behind card */}
      <div
        className={`fixed inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-1000 ${
          isDimmed ? 'opacity-30' : 'opacity-100'
        }`}
      >
        <div
          className="w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{
            background: `radial-gradient(circle, 
              oklch(var(--glow-primary) / 0.3) 0%, 
              oklch(var(--glow-secondary) / 0.2) 40%, 
              transparent 70%)`,
          }}
        />
      </div>

      {/* Dimming overlay for shooting star */}
      {isDimmed && (
        <div className="fixed inset-0 bg-black/50 animate-fade-in pointer-events-none" />
      )}
    </>
  );
}
