// Compatibility shim: EXEventEmitterService was removed from expo-modules-core 55.x
// expo-av 16.x still imports this header.
#pragma once
#import <Foundation/Foundation.h>
#import <ExpoModulesCore/EXInternalModule.h>

@protocol EXEventEmitterService <EXInternalModule>
- (void)sendEventWithName:(NSString *)eventName body:(id)body;
@end
