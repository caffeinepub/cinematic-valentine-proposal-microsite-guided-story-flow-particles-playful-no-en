import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const promises = [
  "I promise to always make you smile, even on your toughest days, and to be your safe place when the world feels too heavy.",
  "I promise to cherish every moment with you, to celebrate your victories, and to hold your hand through every challenge we face together.",
  "I promise to love you more with each passing day, to grow with you, and to build a beautiful forever that's uniquely ours."
];

export function PromiseScroll() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < promises.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const goToPrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => Math.min(promises.length - 1, prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-2xl mx-auto animate-float-gentle"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="glassmorphism-promise rounded-3xl p-6 md:p-8 promise-glow overflow-hidden">
        <div className="mb-4 text-center">
          <h3 className="font-romantic text-2xl md:text-3xl text-glow-soft animate-shimmer-soft">
            My Promises to You
          </h3>
        </div>

        <div className="relative min-h-[180px] md:min-h-[160px] flex items-center justify-center px-8 md:px-12">
          <div 
            className="transition-all duration-500 ease-out"
            style={{
              opacity: 1,
              transform: 'scale(1)'
            }}
          >
            <p className="font-elegant text-lg md:text-xl lg:text-2xl leading-relaxed text-center text-foreground/90 animate-fade-in-promise">
              {promises[currentIndex]}
            </p>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            aria-label="Previous promise"
            className={`absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full glassmorphism transition-all duration-300 ${
              currentIndex === 0 
                ? 'opacity-30 cursor-not-allowed' 
                : 'opacity-70 hover:opacity-100 hover:scale-110 active:scale-95'
            }`}
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
          </button>

          <button
            onClick={goToNext}
            disabled={currentIndex === promises.length - 1}
            aria-label="Next promise"
            className={`absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full glassmorphism transition-all duration-300 ${
              currentIndex === promises.length - 1 
                ? 'opacity-30 cursor-not-allowed' 
                : 'opacity-70 hover:opacity-100 hover:scale-110 active:scale-95'
            }`}
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {promises.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to promise ${index + 1}`}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-8 h-2 bg-rose-gold'
                  : 'w-2 h-2 bg-foreground/30 hover:bg-foreground/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
