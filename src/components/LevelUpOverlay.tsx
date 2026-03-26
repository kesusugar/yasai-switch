import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/colors';
import { Vegetable } from '../data/vegetables';

interface Props {
  visible: boolean;
  level: number;
  newlyUnlocked: Vegetable[];
}

export const LevelUpOverlay: React.FC<Props> = ({ visible, level, newlyUnlocked }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1.0, useNativeDriver: true, friction: 5 }),
      ]).start();
    } else {
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
      scale.setValue(0.85);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity }]} pointerEvents="none">
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <Text style={styles.title}>レベルアップしました。</Text>
        <Text style={styles.level}>LV {level}</Text>
        {newlyUnlocked.length > 0 && (
          <View style={styles.unlockContainer}>
            <Text style={styles.unlockTitle}>新しい野菜が解放されました！</Text>
            {newlyUnlocked.map((v) => (
              <Text key={v.id} style={styles.unlockItem}>
                🎉 {v.name}
              </Text>
            ))}
          </View>
        )}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    paddingVertical: 36,
    paddingHorizontal: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.TEXT_BLACK,
    marginBottom: 8,
  },
  level: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.CARD_GREEN,
    letterSpacing: 2,
  },
  unlockContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  unlockTitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  unlockItem: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.TEXT_BLACK,
  },
});
