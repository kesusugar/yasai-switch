import { useCallback, useEffect, useRef, useState } from 'react';
import { Vegetable, calcXP, getUnlockedVegetables } from '../data/vegetables';
import { loadGameData, resetGameData, saveGameData } from '../services/storage';
import { trackLevelIfNeeded } from '../services/tenjin';

export type GameState =
  | 'idle'
  | 'menuOpen'
  | 'eating'
  | 'reactionGood'
  | 'reactionNormal'
  | 'reactionBad'
  | 'xpGain'
  | 'levelUp';

const MAX_LEVEL = 30;
const XP_PER_LEVEL = (level: number) => level * 500;

export const useGameState = () => {
  const [level, setLevel] = useState(1);
  const [currentXP, setCurrentXP] = useState(0);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [selectedVeg, setSelectedVeg] = useState<Vegetable | null>(null);
  const [gainedXP, setGainedXP] = useState(0);
  const [didLevelUp, setDidLevelUp] = useState(false);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Vegetable[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const levelRef = useRef(level);
  const currentXPRef = useRef(currentXP);
  levelRef.current = level;
  currentXPRef.current = currentXP;

  // 起動時にデータをロード
  useEffect(() => {
    loadGameData().then(({ level: l, currentXP: xp }) => {
      setLevel(l);
      setCurrentXP(xp);
      setIsLoaded(true);
    });
  }, []);

  // データ変更時に自動保存
  useEffect(() => {
    if (!isLoaded) return;
    saveGameData({ level, currentXP });
  }, [level, currentXP, isLoaded]);

  const unlockedVegetables = getUnlockedVegetables(level);

  const openMenu = useCallback(() => {
    if (gameState !== 'idle') return;
    setGameState('menuOpen');
  }, [gameState]);

  const closeMenu = useCallback(() => {
    if (gameState !== 'menuOpen') return;
    setGameState('idle');
  }, [gameState]);

  const selectVegetable = useCallback(
    (veg: Vegetable) => {
      if (gameState !== 'menuOpen') return;
      setSelectedVeg(veg);
      setGameState('eating');
    },
    [gameState],
  );

  // eating完了後に呼ぶ（Character から callback で呼ばれる）
  const finishEating = useCallback(() => {
    if (!selectedVeg) return;
    const xp = calcXP(selectedVeg);
    setGainedXP(xp);

    const reactionMap: Record<string, GameState> = {
      good: 'reactionGood',
      normal: 'reactionNormal',
      bad: 'reactionBad',
    };
    setGameState(reactionMap[selectedVeg.preference] ?? 'reactionNormal');
  }, [selectedVeg]);

  // リアクション2秒表示後に呼ぶ
  const finishReaction = useCallback(() => {
    setGameState('xpGain');
  }, []);

  // XPバーアニメ完了後に呼ぶ
  const applyXP = useCallback(() => {
    const xp = gainedXP;
    const lv = levelRef.current;
    const curXP = currentXPRef.current;

    if (lv >= MAX_LEVEL) {
      setGameState('idle');
      return;
    }

    const needed = XP_PER_LEVEL(lv);
    const totalXP = curXP + xp;

    if (totalXP >= needed) {
      const newLevel = lv + 1;
      const surplusXP = totalXP - needed;
      const prevUnlocked = getUnlockedVegetables(lv);
      const nextUnlocked = getUnlockedVegetables(newLevel);
      const newVegs = nextUnlocked.filter(
        (v) => !prevUnlocked.find((p) => p.id === v.id),
      );

      setLevel(newLevel);
      setCurrentXP(surplusXP);
      setDidLevelUp(true);
      setNewlyUnlocked(newVegs);
      trackLevelIfNeeded(newLevel);
      setGameState('levelUp');
    } else {
      setCurrentXP(totalXP);
      setDidLevelUp(false);
      setNewlyUnlocked([]);
      setGameState('idle');
    }
  }, [gainedXP]);

  // levelUp演出完了後に呼ぶ
  const finishLevelUp = useCallback(() => {
    setDidLevelUp(false);
    setNewlyUnlocked([]);
    setSelectedVeg(null);
    setGameState('idle');
  }, []);

  const resetGame = useCallback(async () => {
    await resetGameData();
    setLevel(1);
    setCurrentXP(0);
    setGameState('idle');
    setSelectedVeg(null);
    setGainedXP(0);
    setDidLevelUp(false);
    setNewlyUnlocked([]);
  }, []);

  const requiredXP = XP_PER_LEVEL(level);
  const xpRatio = Math.min(currentXP / requiredXP, 1);

  return {
    level,
    currentXP,
    requiredXP,
    xpRatio,
    gameState,
    selectedVeg,
    gainedXP,
    didLevelUp,
    newlyUnlocked,
    unlockedVegetables,
    isLoaded,
    openMenu,
    closeMenu,
    selectVegetable,
    finishEating,
    finishReaction,
    applyXP,
    finishLevelUp,
    resetGame,
  };
};
