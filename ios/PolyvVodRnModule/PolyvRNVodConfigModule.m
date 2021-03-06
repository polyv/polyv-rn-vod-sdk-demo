//
//  PolyvVodConfigRnModule.m
//  PolyvVodRnDemo
//
//  Created by 李长杰 on 2019/2/18.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "PolyvRNVodConfigModule.h"
#import <PLVVodSDK/PLVVodSDK.h>

NSString * NSStringFromPolyvVodRnError(PolyvVodConfigRnErrorCode code) {
  switch (code) {
    case PolyvVodRnError_Success:
      return @"成功";
    case PolyvVodRnError_NoVodKey:
      return @"vodKey为空";
    case PolyvVodRnError_NoDecodeKey:
      return @"decodeKey为空";
    case PolyvVodRnError_NoDecodeIv:
      return @"decodeIv为空";
    case PolyvVodRnError_NoViewerId:
      return @"viewerId为空";
    case PolyvVodRnError_ParseDataError:
      return @"解析视频数据出错";
    case PolyvVodRnError_NoDownloadedVideo:
      return @"获取下载视频为空";
    case PolyvVodRnError_NoUserId:
      return @"userid为空";
    case PolyvVodRnError_NoWriteToken:
      return @"writeToken为空";
    case PolyvVodRnError_NoReadToken:
      return @"readToken为空";
    case PolyvVodRnError_NoSecretKey:
      return @"secretkey为空";
    default:
      return @"";
  }
}

@interface PolyvRNVodConfigModule ()

@property (nonatomic, strong) NSString *decodeKey;
@property (nonatomic, strong) NSString *decodeIv;

@end

@implementation PolyvRNVodConfigModule

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
  
    PolyvVodConfigRnErrorCode errorCode = PolyvVodRnError_Success;
    if (!vodKey.length) {
        errorCode = PolyvVodRnError_NoVodKey;
    } else if (!decodeKey.length) {
        errorCode = PolyvVodRnError_NoDecodeKey;
    } else if (!decodeIv.length) {
        errorCode = PolyvVodRnError_NoDecodeIv;
    } else if (!viewerId.length) {
      errorCode = PolyvVodRnError_NoViewerId;
    }
    
    if (errorCode == PolyvVodRnError_Success) {
        self.decodeKey = decodeKey;
        self.decodeIv = decodeIv;
      
        NSError *error = nil;
        PLVVodSettings *settings = [PLVVodSettings settingsWithConfigString:vodKey key:decodeKey iv:decodeIv error:&error];
        NSString *readToken = settings.readtoken;
      
        settings.logLevel = PLVVodLogLevelAll;
      
        settings.viewerId = viewerId;
        settings.viewerName = nickName ? nickName : @"游客";
      
        NSDictionary *dic = @{ @"code": @(PolyvVodRnError_Success), @"token":readToken, @"isSign":@(NO) };
      
        resolve(dic);
    } else {
        NSString *errorDesc = NSStringFromPolyvVodRnError(errorCode);
        NSError *error = [NSError errorWithDomain:NSURLErrorDomain code:errorCode userInfo:@{NSLocalizedDescriptionKey:errorDesc}];
        NSLog(@"%@", errorDesc);
        reject([@(errorCode) stringValue], errorDesc, error);
    }
}

RCT_EXPORT_METHOD(setToken:(NSString *)userid
                  writetoken:(NSString *)writetoken
                  readtoken:(NSString *)readtoken
                  secretkey:(NSString *)secretkey
                  viewerId:(NSString *)viewerId
                  nickName:(NSString *)nickName
                  findEventsWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )
{
    NSLog(@"setToken() - %@", userid);
  
    PolyvVodConfigRnErrorCode errorCode = PolyvVodRnError_Success;
    if (!userid.length) {
        errorCode = PolyvVodRnError_NoUserId;
    } else if (!secretkey.length) {
        errorCode = PolyvVodRnError_NoSecretKey;
    } else if (!readtoken.length) {
        errorCode = PolyvVodRnError_NoReadToken;
    } else if (!writetoken.length) {
      errorCode = PolyvVodRnError_NoWriteToken;
    } else if (!viewerId.length) {
      errorCode = PolyvVodRnError_NoViewerId;
    }
    
    if (errorCode == PolyvVodRnError_Success) {
      
        PLVVodSettings *settings = [PLVVodSettings settingsWithUserid:userid readtoken:readtoken writetoken:writetoken secretkey:secretkey];
            
        settings.logLevel = PLVVodLogLevelAll;
      
        settings.viewerId = viewerId;
        settings.viewerName = nickName ? nickName : @"游客";
      
        NSDictionary *dic = @{ @"code": @(PolyvVodRnError_Success), @"token":readtoken, @"isSign":@(NO) };
      
        resolve(dic);
    } else {
        NSString *errorDesc = NSStringFromPolyvVodRnError(errorCode);
        NSError *error = [NSError errorWithDomain:NSURLErrorDomain code:errorCode userInfo:@{NSLocalizedDescriptionKey:errorDesc}];
        NSLog(@"%@", errorDesc);
        reject([@(errorCode) stringValue], errorDesc, error);
    }
}

@end
