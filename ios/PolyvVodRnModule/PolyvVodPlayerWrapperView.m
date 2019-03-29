//
//  PolyvVodPlayerWrapperView.m
//  PolyvVodRnDemo
//
//  Created by 李长杰 on 2019/2/18.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "PolyvVodPlayerWrapperView.h"
#import <PLVVodSDK/PLVVodSDK.h>
#import "PLVVodSkinPlayerController.h"

@interface PolyvVodPlayerWrapperView ()

@property (nonatomic, strong) NSString *vid;
@property (nonatomic, strong) PLVVodSkinPlayerController *player;

@property CGRect orginRect;

@property float screenWidth;
@property float screenHeight;

@end

@implementation PolyvVodPlayerWrapperView

// 初始化播放器
- (void)setup {
  self.player = [[PLVVodSkinPlayerController alloc] initWithNibName:nil bundle:nil];
  self.player.rememberLastPosition = YES;
  self.player.enableBackgroundPlayback = YES;
  [self addSubview:self.player.view];
  
  CGRect frame = self.player.view.frame;
  frame.size = self.frame.size;
  self.player.view.frame = frame;
  self.player.view.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
  
  CGRect screenBounds = [UIScreen mainScreen].bounds;
  self.screenWidth = screenBounds.size.width;
  self.screenHeight = screenBounds.size.height;
  self.orginRect = CGRectZero;
  
  self.player.wrapperView = self;
}

- (void)setPlay_parameters:(NSDictionary *)play_parameters {
  BOOL autoplay = ((NSNumber *)[play_parameters objectForKey:@"is_auto_start"]).boolValue;
  self.player.autoplay = autoplay;
  
  NSString *vid = [play_parameters objectForKey:@"vid"];
  [self updateVid:vid];
}

// 全屏-半屏切换
- (void)switchToFullScreen:(BOOL)fullScreen {
  NSLog(@"switchToFullScreen - %@", self);
  if (fullScreen) {
    NSLog(@"switch to fullScreen");
    self.orginRect = self.player.view.frame;
    self.player.view.frame = CGRectMake(0, 0, self.screenHeight, self.screenWidth);
    
    [self.player.view removeFromSuperview];
    [[UIApplication sharedApplication].keyWindow addSubview:self.player.view];
  } else {
    NSLog(@"switch to halfScreen");
    if (!CGRectEqualToRect(self.orginRect, CGRectZero)) {
      self.player.view.frame = self.orginRect;
      
      [self.player.view removeFromSuperview];
      [self addSubview:self.player.view];
    }
  }
}

// 切换vid
- (void)updateVid:(NSString *)vid {
  if (vid.length == 0 || [_vid isEqualToString:vid]) {
    return;
  }
  
  _vid = vid;
  
  // 无网络情况下，优先检测本地视频文件
  PLVVodLocalVideo *local = [PLVVodLocalVideo localVideoWithVid:vid dir:[PLVVodDownloadManager sharedManager].downloadDir];
  if (local && local.path){
    self.player.video = local;
  } else {
    // 有网情况下，也可以调用此接口，只要存在本地视频，都会优先播放本地视频
    __weak typeof(self) weakSelf = self;
    [PLVVodVideo requestVideoWithVid:vid completion:^(PLVVodVideo *video, NSError *error) {
      if (!video.available) {
        return;
      }
      weakSelf.player.video = video;
    }];
  }
}

// 开始/停止
- (void)startOrPause {
  if (self.player.playbackState == PLVVodPlaybackStatePlaying) {
    [self.player pause];
  } else if (self.player.playbackState == PLVVodPlaybackStatePaused
             || self.player.playbackState == PLVVodPlaybackStateStopped) {
    [self.player play];
  }
}

// 开始
- (void)start {
    [self.player play];
}

// 停止
- (void)pause {
    [self.player pause];
}

// 销毁
- (void)destroyPlayer {
  [self.player destroyPlayer];
}

@end
