//
//  PolyvVodPlayerWrapperView.h
//  PolyvVodRnDemo
//
//  Created by 李长杰 on 2019/2/18.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface PolyvVodPlayerWrapperView : UIView

@property (nonatomic, strong) NSDictionary *play_parameters;

// 初始化播放器
- (void)setup;

// 全屏-半屏切换
- (void)switchToFullScreen:(BOOL)fullScreen;

// 切换vid
- (void)updateVid:(NSString *)vid;

// 开始/停止
- (void)startOrPause;

// 开始
- (void)start;

// 停止
- (void)pause;

// 销毁
- (void)destroyPlayer;

@end

NS_ASSUME_NONNULL_END
