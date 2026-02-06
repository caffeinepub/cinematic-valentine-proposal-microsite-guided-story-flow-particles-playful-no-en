import { useState, useEffect } from 'react';
import { LightSweepText } from './LightSweepText';

interface TypingIntroStageProps {
  onComplete: () => void;
}

export function TypingIntroStage({ onComplete }: TypingIntroStageProps) {
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [showCursor1, setShowCursor1] = useState(true);
  const [showCursor2, setShowCursor2] = useState(false);
  const [showMainText, setShowMainText] = useState(false);

  const fullLine1 = 'Dear Fatima urf Meethadil…';
  const fullLine2 = 'Jab se tum meri zindagi mein aayi ho, sab kuch thoda aur khoobsurat lagne laga hai…';

  useEffect(() => {
    let index = 0;
    const typingSpeed = 80;

    const typeInterval = setInterval(() => {
      if (index < fullLine1.length) {
        setLine1(fullLine1.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typeInterval);
        setShowCursor1(false);
        setTimeout(() => {
          setShowCursor2(true);
          let index2 = 0;
          const typeInterval2 = setInterval(() => {
            if (index2 < fullLine2.length) {
              setLine2(fullLine2.slice(0, index2 + 1));
              index2++;
            } else {
              clearInterval(typeInterval2);
              setShowCursor2(false);
              setTimeout(() => {
                setShowMainText(true);
                setTimeout(() => {
                  onComplete();
                }, 3000);
              }, 500);
            }
          }, typingSpeed);
        }, 800);
      }
    }, typingSpeed);

    return () => clearInterval(typeInterval);
  }, [onComplete]);

  return (
    <div className="max-w-4xl mx-auto text-center px-6">
      <div className="glassmorphism-strong rounded-3xl p-8 md:p-12 card-glow animate-float-breath">
        <div className="space-y-6 min-h-[300px] flex flex-col justify-center">
          <p className="font-romantic text-3xl md:text-5xl text-glow-soft">
            {line1}
            {showCursor1 && <span className="animate-blink">|</span>}
          </p>
          
          {line2 && (
            <p className="font-elegant text-xl md:text-2xl text-foreground/90 leading-relaxed">
              {line2}
              {showCursor2 && <span className="animate-blink">|</span>}
            </p>
          )}

          {showMainText && (
            <div className="pt-8 animate-scale-in">
              <LightSweepText>
                <h1 className="font-romantic text-4xl md:text-6xl lg:text-7xl text-glow leading-tight">
                  Will You Be My Valentine?
                </h1>
              </LightSweepText>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
