//
//  PolyvVodConfigRnModule.h
//  PolyvVodRnDemo
//
//  Created by 李长杰 on 2019/2/18.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * code，返回码定义：
 *      0  成功
 *      -1 vodKey为空
 *      -2 decodeKey为空
 *      -3 decodeIv为空
 *      -4 ViewId为空
 *      -5 解析数据错误
 *      -6 没有正在下载的视频
 *      -7 userid为空
 *      -8 writeToken为空
 *      -9 readToken为空
 *      -10 secretkey为空
 */
typedef NS_ENUM(NSInteger, PolyvVodConfigRnErrorCode) {
  PolyvVodRnError_Success = 0,
  PolyvVodRnError_NoVodKey = -1,
  PolyvVodRnError_NoDecodeKey = -2,
  PolyvVodRnError_NoDecodeIv = -3,
  PolyvVodRnError_NoViewerId = -4,
  PolyvVodRnError_ParseDataError = -5,
  PolyvVodRnError_NoDownloadedVideo = -6,
  PolyvVodRnError_NoUserId = -7,
  PolyvVodRnError_NoWriteToken = -8,
  PolyvVodRnError_NoReadToken = -9,
  PolyvVodRnError_NoSecretKey = -10
};

@interface PolyvRNVodConfigModule : NSObject <RCTBridgeModule>

@end

NS_ASSUME_NONNULL_END
