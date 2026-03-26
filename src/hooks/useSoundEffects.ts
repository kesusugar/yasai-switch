import { Audio } from 'expo-av';
import { useCallback, useEffect, useRef } from 'react';

type SoundKey =
  | 'tap'
  | 'select'
  | 'eat'
  | 'good'
  | 'normal'
  | 'bad'
  | 'xp'
  | 'levelup';

const SOUND_FILES: Record<SoundKey, ReturnType<typeof require>> = {
  tap: require('../../assets/sounds/tap.mp3'),
  select: require('../../assets/sounds/select.mp3'),
  eat: require('../../assets/sounds/eat.mp3'),
  good: require('../../assets/sounds/good.mp3'),
  normal: require('../../assets/sounds/normal.mp3'),
  bad: require('../../assets/sounds/bad.mp3'),
  xp: require('../../assets/sounds/xp.mp3'),
  levelup: require('../../assets/sounds/levelup.mp3'),
};

const VOLUME: Record<SoundKey, number> = {
  tap: 0.6,
  select: 0.65,
  eat: 0.7,
  good: 0.75,
  normal: 0.6,
  bad: 0.7,
  xp: 0.6,
  levelup: 0.8,
};

export const useSoundEffects = () => {
  const soundsRef = useRef<Partial<Record<SoundKey, Audio.Sound>>>({});
  const loadedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const loadAll = async () => {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      const entries = Object.entries(SOUND_FILES) as [SoundKey, ReturnType<typeof require>][];
      await Promise.all(
        entries.map(async ([key, file]) => {
          try {
            const { sound } = await Audio.Sound.createAsync(file, {
              volume: VOLUME[key],
              shouldPlay: false,
            });
            if (!cancelled) {
              soundsRef.current[key] = sound;
            } else {
              await sound.unloadAsync();
            }
          } catch {
            // 音ファイルが未配置の場合は無視（開発中は仮ファイルなしでも動く）
          }
        }),
      );
      if (!cancelled) loadedRef.current = true;
    };

    loadAll();

    return () => {
      cancelled = true;
      Object.values(soundsRef.current).forEach((s) => {
        s?.unloadAsync().catch(() => {});
      });
      soundsRef.current = {};
      loadedRef.current = false;
    };
  }, []);

  const playSound = useCallback(async (key: SoundKey) => {
    const sound = soundsRef.current[key];
    if (!sound) return;
    try {
      await sound.setPositionAsync(0);
      await sound.playAsync();
    } catch {
      // 再生失敗は無視
    }
  }, []);

  return { playSound };
};
