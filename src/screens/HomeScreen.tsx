import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../constants/colors';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { useGameState } from '../hooks/useGameState';

export type RootStackParamList = {
  Home: undefined;
  Game: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { playSound } = useSoundEffects();
  const { resetGame } = useGameState();

  const handleStart = async () => {
    await playSound('tap');
    navigation.navigate('Game');
  };

  const handleReset = () => {
    Alert.alert(
      'リセット確認',
      'Lv.1からやり直しますか？\nデータは全て消えます。',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: 'リセット',
          style: 'destructive',
          onPress: async () => {
            await playSound('tap');
            await resetGame();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>ヤサイスイッチ</Text>

      <View style={styles.characterContainer}>
        <Image
          source={require('../../assets/images/character_idle.png')}
          style={styles.characterImage}
          resizeMode="contain"
        />
      </View>

      <TouchableOpacity style={styles.startButton} onPress={handleStart} activeOpacity={0.85}>
        <Text style={styles.startButtonText}>野菜をあげる</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resetButton} onPress={handleReset} activeOpacity={0.8}>
        <Text style={styles.resetButtonText}>Lv.1にリセット</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND_DARK,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 48,
  },
  title: {
    fontFamily: 'System',
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.TEXT_CREAM,
    letterSpacing: 2,
    marginTop: 16,
  },
  characterContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterImage: {
    width: 220,
    height: 220,
    borderRadius: 110,
  },
  startButton: {
    backgroundColor: Colors.CARD_GREEN,
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.TEXT_BLACK,
    letterSpacing: 1,
  },
  resetButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  resetButtonText: {
    fontSize: 13,
    color: 'rgba(255,250,247,0.45)',
    textDecorationLine: 'underline',
  },
});
