import { useState, useEffect } from 'react';
import { LightSweepText } from './LightSweepText';

interface StorySlidesStageProps {
  onComplete: () => void;
}

const slides = [
  'Jab se tum meri life ka hissa bani ho, sab kuch thoda aur meaningful ho gaya.',
  'Main perfect nahi hoon, par tumhare saath har din better banna chahta hoon.',
  'Fatima… kya tum meri Valentine banogi, sirf aaj nahi balki hamesha?',
];

export function StorySlidesStage({ onComplete }: StorySlidesStageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timers = slides.map((_, index) =>
      setTimeout(() => {
        setCurrentSlide(index);
        if (index === slides.length - 1) {
          setTimeout(onComplete, 4000);
        }
      }, index * 4000)
    );

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="max-w-4xl mx-auto text-center px-6">
      <div className="glassmorphism-strong rounded-3xl p-8 md:p-12 card-glow animate-float-breath">
        <div className="min-h-[300px] flex items-center justify-center relative">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${
                currentSlide === index ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <LightSweepText>
                <p className="font-elegant text-2xl md:text-3xl lg:text-4xl text-glow-soft leading-relaxed px-4">
                  {slide}
                </p>
              </LightSweepText>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
