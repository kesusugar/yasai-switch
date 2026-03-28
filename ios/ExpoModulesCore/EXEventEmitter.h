// Compatibility shim: EXEventEmitter was removed from expo-modules-core 55.x
// expo-av 16.x still imports this header.
#pragma once
#import <Foundation/Foundation.h>

@protocol EXEventEmitter <NSObject>
- (NSArray<NSString *> *)supportedEvents;
- (void)startObserving;
- (void)stopObserving;
@end
