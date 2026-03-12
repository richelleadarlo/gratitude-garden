import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const STORAGE_KEY = 'ambientNaturePianoEnabled';

const AUDIO_SRC = '/Faraway_Places_Sunday_Mornings_KLICKAUD.mp3';

const AmbientBirdsToggle = () => {
  const [isEnabled, setIsEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === null ? true : saved === 'true';
    } catch {
      return true;
    }
  });

  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(isEnabled));
    } catch {
      // Ignore storage failures
    }
  }, [isEnabled]);

  useEffect(() => {
    const audio = new Audio(AUDIO_SRC);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.70;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!hasInteracted || !audioRef.current) return;

    if (isEnabled) {
      void audioRef.current.play().catch(() => {
        // Ignore autoplay/playback failures until next interaction
      });
      return;
    }

    audioRef.current.pause();
  }, [hasInteracted, isEnabled]);

  useEffect(() => {
    const startOnFirstInteraction = () => {
      setHasInteracted(true);
    };

    window.addEventListener('pointerdown', startOnFirstInteraction, { once: true });
    window.addEventListener('keydown', startOnFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('pointerdown', startOnFirstInteraction);
      window.removeEventListener('keydown', startOnFirstInteraction);
    };
  }, []);

  const handleToggle = () => {
    setHasInteracted(true);
    setIsEnabled((prev) => !prev);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isEnabled ? 'Mute ambient piano' : 'Play ambient piano'}
      title={isEnabled ? 'Mute ambient piano' : 'Play ambient piano'}
      className="fixed top-4 right-4 z-30 glass-panel rounded-full p-2.5 inline-flex items-center justify-center text-foreground/95 hover:glass-panel-hover transition-shadow"
    >
      {isEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
    </button>
  );
};

export default AmbientBirdsToggle;
