import { ReactNode } from 'react';

interface LightSweepTextProps {
  children: ReactNode;
}

export function LightSweepText({ children }: LightSweepTextProps) {
  return (
    <div className="relative inline-block">
      {children}
      <div
        className="absolute inset-0 pointer-events-none animate-shimmer"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, oklch(1 0 0 / 0.3) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
        }}
      />
    </div>
  );
}
