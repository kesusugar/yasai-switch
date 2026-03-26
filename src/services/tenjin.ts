/**
 * Tenjin SDK ラッパー
 * __DEV__ === true  → console.log のみ（開発・Simulator）
 * __DEV__ === false → 実 Tenjin SDK を呼ぶ（TestFlight / 本番）
 *
 * 本番導入時:
 * 1. ios/Podfile に `pod 'TenjinSDK'` を追加
 * 2. AppDelegate で `[TenjinSDK init:@"YOUR_API_KEY"]` を呼ぶ
 * 3. 下記 realSendEvent のコメントアウトを解除
 */

// import { NativeModules } from 'react-native';
// const { TenjinSDK } = NativeModules;

export const sendEvent = (eventName: string, eventValue: string): void => {
  if (__DEV__) {
    console.log(`[Tenjin MOCK] sendEvent: ${eventName}, value: ${eventValue}`);
    return;
  }
  // 本番: TenjinSDK.sendEventWithName(eventName, eventValue);
  console.log(`[Tenjin] sendEvent: ${eventName}, value: ${eventValue}`);
};

export const TRACKED_LEVELS = [10, 20] as const;

export const trackLevelIfNeeded = (level: number): void => {
  if ((TRACKED_LEVELS as readonly number[]).includes(level)) {
    sendEvent('AchieveLevel', String(level));
  }
};
