import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useRef } from 'react';
import { Image, SafeAreaView, StyleSheet, View } from 'react-native';
import { Character } from '../components/Character';
import { LevelUpOverlay } from '../components/LevelUpOverlay';
import { ReactionOverlay } from '../components/ReactionOverlay';
import { VegetableCard } from '../components/VegetableCard';
import { XPBar } from '../components/XPBar';
import { Vegetable } from '../data/vegetables';
import { GameState, useGameState } from '../hooks/useGameState';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { RootStackParamList } from './HomeScreen';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Game'>;
};

const LEVEL_UP_DURATION = 1500; // 1.5秒ロック
const REACTION_DURATION = 2000; // 2秒

const LOCKED_STATES: GameState[] = ['eating', 'reactionGood', 'reactionNormal', 'reactionBad', 'xpGain', 'levelUp'];

export const GameScreen: React.FC<Props> = () => {
  const game = useGameState();
  const { playSound } = useSoundEffects();
  const reactionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const levelUpTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isLocked = LOCKED_STATES.includes(game.gameState);

  // サウンドをgameStateの変化に応じて1回だけ鳴らす
  useEffect(() => {
    switch (game.gameState) {
      case 'eating':
        playSound('eat');
        break;
      case 'reactionGood':
        playSound('good');
        break;
      case 'reactionNormal':
        playSound('normal');
        break;
      case 'reactionBad':
        playSound('bad');
        break;
      case 'xpGain':
        playSound('xp');
        break;
      case 'levelUp':
        playSound('levelup');
        break;
    }
  }, [game.gameState]);

  // reactionGood/Normal/Bad → 2秒後に finishReaction
  useEffect(() => {
    if (
      game.gameState === 'reactionGood' ||
      game.gameState === 'reactionNormal' ||
      game.gameState === 'reactionBad'
    ) {
      reactionTimerRef.current = setTimeout(() => {
        game.finishReaction();
      }, REACTION_DURATION);
    }
    return () => {
      if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);
    };
  }, [game.gameState]);

  // levelUp → 1.5秒後に finishLevelUp
  useEffect(() => {
    if (game.gameState === 'levelUp') {
      levelUpTimerRef.current = setTimeout(() => {
        game.finishLevelUp();
      }, LEVEL_UP_DURATION);
    }
    return () => {
      if (levelUpTimerRef.current) clearTimeout(levelUpTimerRef.current);
    };
  }, [game.gameState]);

  const handleVegetableSelect = async (veg: Vegetable) => {
    await playSound('select');
    game.selectVegetable(veg);
  };

  const handleOpenMenu = async () => {
    if (isLocked) return;
    await playSound('tap');
    game.openMenu();
  };

  const isMenuVisible = game.gameState === 'menuOpen';
  const isXPAnimating = game.gameState === 'xpGain';

  return (
    <View style={styles.container}>
      {/* 背景 */}
      <Image
        source={require('../../assets/images/background.png')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      <SafeAreaView style={styles.safeArea}>
        {/* XPバー */}
        <XPBar
          level={game.level}
          xpRatio={game.xpRatio}
          animating={isXPAnimating}
          onAnimationComplete={game.applyXP}
        />

        {/* キャラクター */}
        <View style={styles.characterArea}>
          <Character
            gameState={game.gameState}
            onEatingComplete={game.finishEating}
          />
        </View>

        {/* リアクション・食事中テキスト */}
        <ReactionOverlay gameState={game.gameState} />

        {/* 野菜カード */}
        <VegetableCard
          vegetables={game.unlockedVegetables}
          visible={isMenuVisible}
          onSelect={handleVegetableSelect}
          onClose={game.closeMenu}
          disabled={isLocked}
        />

        {/* 野菜カードが閉じている時のタップ領域（下部） */}
        {!isMenuVisible && !isLocked && (
          <View style={styles.tapArea} onStartShouldSetResponder={() => true} onResponderRelease={handleOpenMenu} />
        )}
      </SafeAreaView>

      {/* レベルアップオーバーレイ */}
      <LevelUpOverlay
        visible={game.gameState === 'levelUp'}
        level={game.level}
        newlyUnlocked={game.newlyUnlocked}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  characterArea: {
    flex: 1,
  },
  tapArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
