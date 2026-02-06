import { useState, useEffect } from 'react';

interface YesCountdownStageProps {
  onComplete: () => void;
}

const countdownLines = [
  'Before you answer…',
  'Just know this…',
  'Every moment with you matters.',
];

export function YesCountdownStage({ onComplete }: YesCountdownStageProps) {
  const [currentLine, setCurrentLine] = useState(0);

  useEffect(() => {
    const timers = countdownLines.map((_, index) =>
      setTimeout(() => {
        setCurrentLine(index);
        if (index === countdownLines.length - 1) {
          setTimeout(onComplete, 2000);
        }
      }, index * 2000)
    );

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="max-w-4xl mx-auto text-center px-6">
      <div className="glassmorphism-strong rounded-3xl p-8 md:p-12 card-glow animate-float-breath">
        <div className="min-h-[200px] flex items-center justify-center">
          {countdownLines.map((line, index) => (
            <p
              key={index}
              className={`font-elegant text-2xl md:text-4xl text-glow-soft absolute transition-opacity duration-1000 ${
                currentLine === index ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
