interface BackButtonProps {
  onClick: () => void;
}

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed top-4 left-4 z-50 glassmorphism px-4 py-2 rounded-xl font-elegant text-sm md:text-base hover:scale-105 transition-all duration-300 cinematic-ease focus:outline-none focus:ring-2 focus:ring-primary/50"
      aria-label="Go back to previous stage"
    >
      ← Back
    </button>
  );
}
