import { useEffect, useState } from 'react';

interface WhyILoveYouModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const loveLines = [
  'Mujhe tumhari hasi pasand hai, kyunki usme meri duniya basti hai.',
  'Tumhare saath chhoti-chhoti baatein bhi yaadgaar ban jaati hain.',
  'Tum mujhe har din thoda aur better insaan bana deti ho.',
  'Tumhare saath rehkar sukoon milta hai jo kahin aur nahi milta.',
  'Aur sabse zyada… mujhe tum pasand ho, bas bina kisi wajah ke.',
];

export function WhyILoveYouModal({ isOpen, onClose }: WhyILoveYouModalProps) {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);

  useEffect(() => {
    if (isOpen) {
      setVisibleLines([]);
      loveLines.forEach((_, index) => {
        setTimeout(() => {
          setVisibleLines((prev) => [...prev, index]);
        }, index * 1000);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      
      <div
        className="relative glassmorphism-strong rounded-3xl p-6 md:p-10 max-w-2xl w-full max-h-[85vh] overflow-y-auto card-glow animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full glassmorphism flex items-center justify-center hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 z-10"
          aria-label="Close"
        >
          <span className="text-2xl">×</span>
        </button>

        <h3 className="font-romantic text-3xl md:text-5xl text-glow text-center mb-8 pt-2">
          Why I Love You
        </h3>

        <div className="space-y-6">
          {loveLines.map((line, index) => (
            <div
              key={index}
              className={`love-line-panel rounded-2xl p-6 transition-opacity duration-700 ${
                visibleLines.includes(index) ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <p className="font-elegant text-lg md:text-xl text-foreground leading-relaxed text-center love-line-text">
                {line}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
