import { forwardRef, useState, MouseEvent, TouchEvent } from 'react';

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const RippleButton = forwardRef<HTMLButtonElement, RippleButtonProps>(
  ({ children, className = '', onClick, ...props }, ref) => {
    const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

    const createRipple = (clientX: number, clientY: number, currentTarget: HTMLElement) => {
      const rect = currentTarget.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const id = Date.now();

      setRipples((prev) => [...prev, { x, y, id }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
      }, 600);
    };

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      createRipple(e.clientX, e.clientY, e.currentTarget);
      onClick?.(e);
    };

    const handleTouchStart = (e: TouchEvent<HTMLButtonElement>) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        createRipple(touch.clientX, touch.clientY, e.currentTarget);
      }
    };

    return (
      <button
        ref={ref}
        className={`relative overflow-hidden ${className}`}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        {...props}
      >
        {children}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full bg-white/30 pointer-events-none animate-ripple"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: '20px',
              height: '20px',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </button>
    );
  }
);

RippleButton.displayName = 'RippleButton';
