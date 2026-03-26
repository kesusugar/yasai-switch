import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import { GameState } from '../hooks/useGameState';

const IMAGES: Record<string, ReturnType<typeof require>> = {
  idle: require('../../assets/images/character_idle.png'),
  eating: require('../../assets/images/character_eating.png'),
  happy: require('../../assets/images/character_happy.png'),
  normal: require('../../assets/images/character_normal.png'),
  sad: require('../../assets/images/character_sad.png'),
  levelup: require('../../assets/images/character_levelup.png'),
};

interface Props {
  gameState: GameState;
  onEatingComplete: () => void;
}

const EATING_TOGGLE_COUNT = 8; // idle↔eating を8回切り替え = 1.2秒
const EATING_INTERVAL = 150; // ms

export const Character: React.FC<Props> = ({ gameState, onEatingComplete }) => {
  const [imageKey, setImageKey] = useState<string>('idle');

  // アニメーション値
  const idleAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const idleLoopRef = useRef<Animated.CompositeAnimation | null>(null);
  const eatingToggleCount = useRef(0);
  const eatingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopIdleLoop = useCallback(() => {
    idleLoopRef.current?.stop();
    idleLoopRef.current = null;
    idleAnim.setValue(0);
  }, [idleAnim]);

  const startIdleLoop = useCallback(() => {
    stopIdleLoop();
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(idleAnim, { toValue: -2, duration: 550, useNativeDriver: true }),
        Animated.timing(idleAnim, { toValue: 0, duration: 550, useNativeDriver: true }),
        Animated.timing(idleAnim, { toValue: 2, duration: 550, useNativeDriver: true }),
        Animated.timing(idleAnim, { toValue: 0, duration: 550, useNativeDriver: true }),
      ]),
    );
    idleLoopRef.current = loop;
    loop.start();
  }, [idleAnim, stopIdleLoop]);

  const playHappy = useCallback(() => {
    scaleAnim.setValue(1);
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1.08, useNativeDriver: true, friction: 4 }),
      Animated.spring(scaleAnim, { toValue: 1.0, useNativeDriver: true, friction: 4 }),
    ]).start();
  }, [scaleAnim]);

  const playShake = useCallback(() => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: -7, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 7, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -7, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 7, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  }, [shakeAnim]);

  const playFadeIn = useCallback(() => {
    opacityAnim.setValue(0);
    Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, [opacityAnim]);

  const playLevelUp = useCallback(() => {
    scaleAnim.setValue(0.85);
    Animated.spring(scaleAnim, { toValue: 1.0, useNativeDriver: true, friction: 5 }).start();
  }, [scaleAnim]);

  const startEating = useCallback(() => {
    eatingToggleCount.current = 0;
    setImageKey('eating');

    const tick = () => {
      eatingToggleCount.current += 1;
      if (eatingToggleCount.current >= EATING_TOGGLE_COUNT) {
        setImageKey('idle');
        onEatingComplete();
        return;
      }
      setImageKey((prev) => (prev === 'eating' ? 'idle' : 'eating'));
      eatingTimerRef.current = setTimeout(tick, EATING_INTERVAL);
    };

    eatingTimerRef.current = setTimeout(tick, EATING_INTERVAL);
  }, [onEatingComplete]);

  useEffect(() => {
    return () => {
      if (eatingTimerRef.current) clearTimeout(eatingTimerRef.current);
      stopIdleLoop();
    };
  }, [stopIdleLoop]);

  useEffect(() => {
    switch (gameState) {
      case 'idle':
      case 'menuOpen':
        setImageKey('idle');
        scaleAnim.setValue(1);
        shakeAnim.setValue(0);
        opacityAnim.setValue(1);
        startIdleLoop();
        break;

      case 'eating':
        stopIdleLoop();
        startEating();
        break;

      case 'reactionGood':
        stopIdleLoop();
        setImageKey('happy');
        playHappy();
        break;

      case 'reactionNormal':
        stopIdleLoop();
        setImageKey('normal');
        playFadeIn();
        break;

      case 'reactionBad':
        stopIdleLoop();
        setImageKey('sad');
        playShake();
        break;

      case 'xpGain':
        // xpGain中はリアクション画像のまま保持
        break;

      case 'levelUp':
        stopIdleLoop();
        setImageKey('levelup');
        playLevelUp();
        break;
    }
  }, [gameState]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.imageWrapper,
          {
            transform: [
              { translateY: idleAnim },
              { translateX: shakeAnim },
              { scale: scaleAnim },
            ],
            opacity: opacityAnim,
          },
        ]}
      >
        <Image
          source={IMAGES[imageKey] ?? IMAGES.idle}
          style={styles.image}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    width: '100%',
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
