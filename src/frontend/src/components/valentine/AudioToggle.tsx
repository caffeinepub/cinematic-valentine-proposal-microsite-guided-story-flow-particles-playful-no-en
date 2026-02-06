import { Volume2, VolumeX } from 'lucide-react';
import { useAudioSystem } from '../../hooks/useAudioSystem';

export function AudioToggle() {
  const { isPlaying, toggle, needsUserGesture } = useAudioSystem();

  return (
    <button
      onClick={toggle}
      className="fixed top-6 right-6 z-[200] glassmorphism p-3 rounded-full hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 button-glow"
      aria-label={isPlaying ? 'Mute audio' : 'Play audio'}
    >
      {needsUserGesture ? (
        <span className="text-sm font-elegant px-2">🎵 Tap to play</span>
      ) : isPlaying ? (
        <Volume2 className="w-6 h-6" />
      ) : (
        <VolumeX className="w-6 h-6" />
      )}
    </button>
  );
}
