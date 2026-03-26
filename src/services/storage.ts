import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  LEVEL: 'game_level',
  CURRENT_XP: 'game_current_xp',
} as const;

export interface SaveData {
  level: number;
  currentXP: number;
}

export const saveGameData = async (data: SaveData): Promise<void> => {
  await AsyncStorage.multiSet([
    [KEYS.LEVEL, String(data.level)],
    [KEYS.CURRENT_XP, String(data.currentXP)],
  ]);
};

export const loadGameData = async (): Promise<SaveData> => {
  const results = await AsyncStorage.multiGet([KEYS.LEVEL, KEYS.CURRENT_XP]);
  const level = parseInt(results[0][1] ?? '1', 10);
  const currentXP = parseInt(results[1][1] ?? '0', 10);
  return {
    level: isNaN(level) ? 1 : Math.max(1, level),
    currentXP: isNaN(currentXP) ? 0 : Math.max(0, currentXP),
  };
};

export const resetGameData = async (): Promise<void> => {
  await AsyncStorage.multiRemove([KEYS.LEVEL, KEYS.CURRENT_XP]);
};
