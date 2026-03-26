import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { GameState } from '../hooks/useGameState';

const REACTION_TEXT: Partial<Record<GameState, string>> = {
  reactionGood: '好物だったようです。',
  reactionNormal: '普通だったようです。',
  reactionBad: '苦手だったようです。',
  eating: '食事中です。',
};

interface Props {
  gameState: GameState;
}

export const ReactionOverlay: React.FC<Props> = ({ gameState }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const text = REACTION_TEXT[gameState];
  const isVisible = !!text;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: isVisible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isVisible, opacity]);

  if (!text && opacity === undefined) return null;

  return (
    <Animated.View style={[styles.container, { opacity }]} pointerEvents="none">
      <Text style={styles.text}>{text}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 240,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    backgroundColor: 'rgba(255,255,255,0.88)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
    overflow: 'hidden',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
