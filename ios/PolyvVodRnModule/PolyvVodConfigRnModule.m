//
//  PolyvVodConfigRnModule.m
//  PolyvVodRnDemo
//
//  Created by 李长杰 on 2019/2/18.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "PolyvVodConfigRnModule.h"
#import <PLVVodSDK/PLVVodSDK.h>

NSString * NSStringFromPolyvVodConfigRnError(PolyvVodConfigRnErrorCode code) {
  switch (code) {
    case PolyvVodConfigRnError_Success:
      return @"成功";
    case PolyvVodConfigRnError_NoVodKey:
      return @"vodKey为空";
    case PolyvVodConfigRnError_NoDecodeKey:
      return @"decodeKey为空";
    case PolyvVodConfigRnError_NoDecodeIv:
      return @"decodeIv为空";
    case PolyvVodConfigRnError_NoViewerId:
      return @"viewerId为空";
    default:
      return @"";
  }
}

@implementation PolyvVodConfigRnModule

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

// 参数 vodKey (必填)
// 参数 decodeKey (必填)
// 参数 decodeIv（必填）
// 参数 viewerId（必填）
// 参数 nickName（选填）
RCT_EXPORT_METHOD(init:(NSString *)vodKey
                  decodeKey:(NSString *)decodeKey
                  decodeIv:(NSString *)decodeIv
                  viewerId:(NSString *)viewerId
                  nickName:(NSString *)nickName
                  findEventsWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )
{
    NSLog(@"config() - %@ 、 %@ 、 %@", vodKey, decodeKey, decodeIv);
  
    PolyvVodConfigRnErrorCode errorCode = PolyvVodConfigRnError_Success;
    if (!vodKey.length) {
        errorCode = PolyvVodConfigRnError_NoVodKey;
    } else if (!decodeKey.length) {
        errorCode = PolyvVodConfigRnError_NoDecodeKey;
    } else if (!decodeIv.length) {
        errorCode = PolyvVodConfigRnError_NoDecodeIv;
    } else if (!viewerId.length) {
      errorCode = PolyvVodConfigRnError_NoViewerId;
    }
    
    if (errorCode == PolyvVodConfigRnError_Success) {
        NSError *error = nil;
        PLVVodSettings *settings = [PLVVodSettings settingsWithConfigString:vodKey key:decodeKey iv:decodeIv error:&error];
      
        settings.logLevel = PLVVodLogLevelAll;
      
        settings.viewerId = viewerId;
        settings.viewerName = nickName ? nickName : @"游客";
        
        resolve(@[@(PolyvVodConfigRnError_Success)]);
    } else {
        NSString *errorDesc = NSStringFromPolyvVodConfigRnError(errorCode);
        NSError *error = [NSError errorWithDomain:NSURLErrorDomain code:errorCode userInfo:@{NSLocalizedDescriptionKey:errorDesc}];
        NSLog(@"%@", errorDesc);
        reject([@(errorCode) stringValue], errorDesc, error);
    }
  
    
  
}

@end
