export type Preference = 'good' | 'normal' | 'bad';

export interface Vegetable {
  id: string;
  name: string;
  baseXP: number;
  preference: Preference;
  unlockLevel: number;
  image: ReturnType<typeof require>;
}

export const XP_MULTIPLIER: Record<Preference, number> = {
  good: 1.5,
  normal: 1.0,
  bad: 0.5,
};

export const VEGETABLES: Vegetable[] = [
  {
    id: 'tomato',
    name: 'トマト',
    baseXP: 30,
    preference: 'good',
    unlockLevel: 1,
    image: require('../../assets/vegetables/tomato.png'),
  },
  {
    id: 'cabbage',
    name: 'キャベツ',
    baseXP: 20,
    preference: 'normal',
    unlockLevel: 1,
    image: require('../../assets/vegetables/cabbage.png'),
  },
  {
    id: 'onion',
    name: 'たまねぎ',
    baseXP: 25,
    preference: 'bad',
    unlockLevel: 1,
    image: require('../../assets/vegetables/onion.png'),
  },
  {
    id: 'carrot',
    name: 'にんじん',
    baseXP: 50,
    preference: 'good',
    unlockLevel: 4,
    image: require('../../assets/vegetables/carrot.png'),
  },
  {
    id: 'spinach',
    name: 'ほうれんそう',
    baseXP: 70,
    preference: 'bad',
    unlockLevel: 7,
    image: require('../../assets/vegetables/spinach.png'),
  },
  {
    id: 'broccoli',
    name: 'ブロッコリー',
    baseXP: 100,
    preference: 'normal',
    unlockLevel: 10,
    image: require('../../assets/vegetables/broccoli.png'),
  },
  {
    id: 'pepper',
    name: 'ピーマン',
    baseXP: 130,
    preference: 'bad',
    unlockLevel: 13,
    image: require('../../assets/vegetables/pepper.png'),
  },
  {
    id: 'eggplant',
    name: 'なす',
    baseXP: 160,
    preference: 'good',
    unlockLevel: 16,
    image: require('../../assets/vegetables/eggplant.png'),
  },
  {
    id: 'goya',
    name: 'ゴーヤ',
    baseXP: 200,
    preference: 'bad',
    unlockLevel: 19,
    image: require('../../assets/vegetables/goya.png'),
  },
  {
    id: 'asparagus',
    name: 'アスパラガス',
    baseXP: 250,
    preference: 'good',
    unlockLevel: 22,
    image: require('../../assets/vegetables/asparagus.png'),
  },
  {
    id: 'celery',
    name: 'セロリ',
    baseXP: 300,
    preference: 'bad',
    unlockLevel: 25,
    image: require('../../assets/vegetables/celery.png'),
  },
  {
    id: 'mushroom',
    name: 'きのこ',
    baseXP: 400,
    preference: 'good',
    unlockLevel: 28,
    image: require('../../assets/vegetables/mushroom.png'),
  },
];

export const getUnlockedVegetables = (level: number): Vegetable[] =>
  VEGETABLES.filter((v) => v.unlockLevel <= level);

export const calcXP = (veg: Vegetable): number =>
  Math.floor(veg.baseXP * XP_MULTIPLIER[veg.preference]);
