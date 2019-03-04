//
//  PolyvVodPlayerViewManager.m
//  PolyvVodRnDemo
//
//  Created by 李长杰 on 2019/2/15.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "PolyvVodPlayerManager.h"
#import "PolyvVodPlayerWrapperView.h"
#import <React/RCTUIManager.h>
#import <React/UIView+React.h>

@implementation PolyvVodPlayerManager

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

RCT_EXPORT_VIEW_PROPERTY(play_parameters, NSDictionary)

- (UIView *)view
{
  PolyvVodPlayerWrapperView *wrapper = [[PolyvVodPlayerWrapperView alloc] init];
  [wrapper setup];
  return wrapper;
}

RCT_EXPORT_METHOD(
                  updateVid:(nonnull NSNumber *)reactTag
                  vid:(NSString *)vid
                  )
{
  RCTUIManager *uiManager = _bridge.uiManager;
  dispatch_async(uiManager.methodQueue, ^{
    [uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
      UIView *view = viewRegistry[reactTag];
      if ([view isKindOfClass:[PolyvVodPlayerWrapperView class]]) {
        PolyvVodPlayerWrapperView *wrapper = (PolyvVodPlayerWrapperView *)view;
        [wrapper updateVid:vid];
      }
    }];
  });
}

RCT_EXPORT_METHOD(
                  startOrPause:(nonnull NSNumber *)reactTag
                  )
{
  NSLog(@"startOrPause");
  RCTUIManager *uiManager = _bridge.uiManager;
  dispatch_async(uiManager.methodQueue, ^{
    [uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
      UIView *view = viewRegistry[reactTag];
      if ([view isKindOfClass:[PolyvVodPlayerWrapperView class]]) {
        PolyvVodPlayerWrapperView *wrapper = (PolyvVodPlayerWrapperView *)view;
        [wrapper startOrPause];
      }
    }];
  });
}

@end
