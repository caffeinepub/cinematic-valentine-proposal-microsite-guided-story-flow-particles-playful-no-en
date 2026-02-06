import { useState, useRef, useEffect, RefObject } from 'react';
import { RippleButton } from './RippleButton';
import { findSafePosition } from '@/utils/geometry';

const shayariLines = [
  'Sach kahun Fatima, tumhe dekhkar har din thoda aur accha lagne lagta hai.',
  'Tumhari aankhon mein jo sukoon hai na, woh poori duniya ghoom kar bhi nahi milta.',
  'Pata nahi kyun, par tumhari ek smile pura din better bana deti hai.',
  'Tumhare saath waqt rukta nahi, par yaadein zaroor ruk jaati hain.',
  'Tum khoobsurat sirf dikhti nahi ho, tumhari baatein bhi utni hi khoobsurat hain.',
  'Kabhi socha nahi tha kisi ki aadat itni pyari ho sakti hai.',
  'Shayad isliye tum special ho, kyunki tum jaisi koi aur nahi.',
  'Tumhari hasi sunke lagta hai duniya thodi aur acchi ho gayi.',
  'Tum paas hoti ho toh har tension chhoti si lagne lagti hai.',
  'Bas itna sa sach hai… tum ho toh sab kuch thoda zyada achha lagta hai.',
];

interface NoButtonEngineProps {
  yesButtonRef: RefObject<HTMLButtonElement | null>;
  whyButtonRef: RefObject<HTMLButtonElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
}

export function NoButtonEngine({ yesButtonRef, whyButtonRef, containerRef }: NoButtonEngineProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [currentShayari, setCurrentShayari] = useState('');
  const [isMoving, setIsMoving] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const shayariRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);

  const moveButton = () => {
    if (!buttonRef.current || !containerRef.current) return;

    const container = containerRef.current.getBoundingClientRect();
    const button = buttonRef.current.getBoundingClientRect();

    // Collect all elements to avoid
    const avoidElements: DOMRect[] = [];
    
    if (yesButtonRef.current) {
      avoidElements.push(yesButtonRef.current.getBoundingClientRect());
    }
    if (whyButtonRef.current) {
      avoidElements.push(whyButtonRef.current.getBoundingClientRect());
    }
    if (shayariRef.current) {
      avoidElements.push(shayariRef.current.getBoundingClientRect());
    }
    if (captionRef.current) {
      avoidElements.push(captionRef.current.getBoundingClientRect());
    }

    const newPosition = findSafePosition(
      container,
      { width: button.width, height: button.height },
      avoidElements,
      60 // minimum safe distance in pixels
    );

    setIsMoving(true);
    setPosition(newPosition);
    setCurrentShayari(shayariLines[Math.floor(Math.random() * shayariLines.length)]);

    setTimeout(() => setIsMoving(false), 600);
  };

  useEffect(() => {
    if (buttonRef.current && containerRef.current) {
      const container = containerRef.current.getBoundingClientRect();
      const button = buttonRef.current.getBoundingClientRect();
      const centerX = (container.width - button.width) / 2;
      const centerY = (container.height - button.height) / 2;
      setPosition({ x: centerX, y: centerY });
    }
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="relative w-full h-full">
        {currentShayari && (
          <div
            ref={shayariRef}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 max-w-md animate-fade-in pointer-events-none z-10"
          >
            <p className="font-elegant text-base md:text-lg text-center text-glow-soft px-4">
              {currentShayari}
            </p>
          </div>
        )}

        <div
          ref={buttonRef}
          className="absolute pointer-events-auto transition-all duration-500 ease-out"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: isMoving ? 'scale(0.95)' : 'scale(1)',
          }}
          onMouseEnter={moveButton}
          onTouchStart={(e) => {
            e.preventDefault();
            moveButton();
          }}
        >
          <RippleButton
            onClick={moveButton}
            className="glassmorphism px-8 py-4 rounded-2xl font-elegant text-xl md:text-2xl font-semibold border-2 border-primary/30 hover:border-primary/60 transition-all duration-300 cinematic-ease"
          >
            NO 🙈
          </RippleButton>
        </div>

        <div
          ref={captionRef}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-none"
        >
          <p className="font-elegant text-sm md:text-base text-center text-foreground/70">
            Itni aasani se NO nahi bol sakti 🙂
          </p>
        </div>
      </div>
    </div>
  );
}
