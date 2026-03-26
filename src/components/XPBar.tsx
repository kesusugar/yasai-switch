import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/colors';

interface Props {
  level: number;
  xpRatio: number; // 0.0 ~ 1.0
  animating: boolean;
  onAnimationComplete?: () => void;
}

export const XPBar: React.FC<Props> = ({ level, xpRatio, animating, onAnimationComplete }) => {
  const widthAnim = useRef(new Animated.Value(xpRatio)).current;
  const prevRatio = useRef(xpRatio);

  useEffect(() => {
    if (!animating) {
      widthAnim.setValue(xpRatio);
      prevRatio.current = xpRatio;
      return;
    }

    // レベルアップ時: 満タン → 0にリセット → 余剰分まで伸ばす
    const wasLevelUp = prevRatio.current > xpRatio + 0.1;

    if (wasLevelUp) {
      Animated.sequence([
        Animated.timing(widthAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(widthAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.timing(widthAnim, {
          toValue: xpRatio,
          duration: 500,
          useNativeDriver: false,
        }),
      ]).start(() => {
        prevRatio.current = xpRatio;
        onAnimationComplete?.();
      });
    } else {
      Animated.timing(widthAnim, {
        toValue: xpRatio,
        duration: 600,
        useNativeDriver: false,
      }).start(() => {
        prevRatio.current = xpRatio;
        onAnimationComplete?.();
      });
    }
  }, [animating, xpRatio]);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.levelText}>LV{level}</Text>
      <View style={styles.barContainer}>
        <Animated.View
          style={[
            styles.barFill,
            {
              width: widthAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 8,
  },
  levelText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.TEXT_BLACK,
    minWidth: 36,
  },
  barContainer: {
    flex: 1,
    height: 16,
    backgroundColor: Colors.XP_BAR_BG,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.XP_BAR_FILL,
    borderRadius: 8,
  },
});
