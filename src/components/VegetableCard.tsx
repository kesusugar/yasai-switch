import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Vegetable } from '../data/vegetables';

interface Props {
  vegetables: Vegetable[];
  visible: boolean;
  onSelect: (veg: Vegetable) => void;
  onClose: () => void;
  disabled: boolean;
}

const CARD_HEIGHT = 220;

export const VegetableCard: React.FC<Props> = ({
  vegetables,
  visible,
  onSelect,
  onClose,
  disabled,
}) => {
  const translateY = useRef(new Animated.Value(CARD_HEIGHT)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : CARD_HEIGHT,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <Animated.View
      style={[styles.card, { transform: [{ translateY }] }]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <TouchableOpacity style={styles.handle} onPress={onClose} activeOpacity={0.7}>
        <View style={styles.handleBar} />
        <Text style={styles.label}>野菜を選ぶ ▼</Text>
      </TouchableOpacity>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {vegetables.map((veg) => (
          <TouchableOpacity
            key={veg.id}
            style={styles.vegItem}
            onPress={() => !disabled && onSelect(veg)}
            activeOpacity={0.75}
            disabled={disabled}
          >
            <Image source={veg.image} style={styles.vegImage} resizeMode="contain" />
            <Text style={styles.vegName}>{veg.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: CARD_HEIGHT,
    backgroundColor: Colors.CARD_GREEN,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#111',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    paddingBottom: 16,
  },
  handle: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 6,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: 2,
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.TEXT_BLACK,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
    alignItems: 'center',
  },
  vegItem: {
    alignItems: 'center',
    width: 80,
  },
  vegImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  vegName: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.TEXT_BLACK,
    marginTop: 4,
    textAlign: 'center',
  },
});
