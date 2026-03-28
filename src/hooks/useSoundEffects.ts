// Sound effects are stubbed out — expo-av will be added back once audio assets are ready.
import { useCallback } from 'react';

type SoundKey = 'tap' | 'select' | 'eat' | 'good' | 'normal' | 'bad' | 'xp' | 'levelup';

export const useSoundEffects = () => {
  const playSound = useCallback((_key: SoundKey) => {
    // no-op until audio assets are provided
  }, []);

  return { playSound };
};
