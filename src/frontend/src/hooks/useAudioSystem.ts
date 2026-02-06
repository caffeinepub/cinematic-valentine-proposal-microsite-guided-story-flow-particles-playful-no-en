import { useState, useEffect, useRef, useCallback } from 'react';

export function useAudioSystem() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [needsUserGesture, setNeedsUserGesture] = useState(true);
  
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const ambientRef = useRef<HTMLAudioElement | null>(null);
  const heartbeatRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    bgMusicRef.current = new Audio('/assets/audio/romantic-instrumental.mp3');
    ambientRef.current = new Audio('/assets/audio/soft-ambient.mp3');
    heartbeatRef.current = new Audio('/assets/audio/heartbeat-once.mp3');

    if (bgMusicRef.current) {
      bgMusicRef.current.loop = true;
      bgMusicRef.current.volume = 0.4;
    }
    if (ambientRef.current) {
      ambientRef.current.loop = true;
      ambientRef.current.volume = 0.2;
    }
    if (heartbeatRef.current) {
      heartbeatRef.current.volume = 0.5;
    }

    return () => {
      bgMusicRef.current?.pause();
      ambientRef.current?.pause();
      heartbeatRef.current?.pause();
    };
  }, []);

  const toggle = useCallback(async () => {
    if (!bgMusicRef.current || !ambientRef.current) return;

    try {
      if (isPlaying) {
        bgMusicRef.current.pause();
        ambientRef.current.pause();
        setIsPlaying(false);
      } else {
        await bgMusicRef.current.play();
        await ambientRef.current.play();
        setIsPlaying(true);
        setNeedsUserGesture(false);
      }
    } catch (error) {
      setNeedsUserGesture(true);
    }
  }, [isPlaying]);

  const playHeartbeat = useCallback(() => {
    if (heartbeatRef.current && isPlaying) {
      heartbeatRef.current.currentTime = 0;
      heartbeatRef.current.play().catch(() => {
        // Silent fail
      });
    }
  }, [isPlaying]);

  return {
    isPlaying,
    toggle,
    playHeartbeat,
    needsUserGesture,
  };
}
