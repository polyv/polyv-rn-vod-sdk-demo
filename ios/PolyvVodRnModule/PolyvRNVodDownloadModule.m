//
//  PolyvVodDownloadRnModule.m
//  PolyvVodRnDemo
//
//  Created by 李长杰 on 2019/3/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "PolyvRNVodDownloadModule.h"
#import "PLVDownloadCompleteInfoModel.h"
#import <PLVVodSDK/PLVVodSDK.h>


NSString *pauseDownloadEvent = @"pauseDownloadEvent";
NSString *startDownloadEvent = @"startDownloadEvent";
NSString *downloadSuccessEvent = @"downloadSuccessEvent";
NSString *downloadFailedEvent = @"downloadFailedEvent";
NSString *updateProgressEvent = @"updateProgressEvent";
NSString *downloadSpeedEvent = @"downloadSpeedEvent";


@implementation PolyvRNVodDownloadModule

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

#pragma mark -- RCT_EXPORT_METHOD
RCT_EXPORT_METHOD(getBitrateNumbers:(NSString *)vid
                  findEventsWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )
{
  if (vid.length == 0) {
    return;
  }
  NSLog(@"getBitrateNumbers() - %@", vid);
  
  // 无网络情况下，优先检测本地视频文件
  PLVVodLocalVideo *local = [PLVVodLocalVideo localVideoWithVid:vid dir:[PLVVodDownloadManager sharedManager].downloadDir];
  if (local && local.path){
    NSMutableDictionary *dic = [PolyvRNVodDownloadModule formatDefinition:local.qualityCount];
    resolve(dic);
  } else {
    // 有网情况下，也可以调用此接口，只要存在本地视频，都会优先播放本地视频
    [PLVVodVideo requestVideoWithVid:vid completion:^(PLVVodVideo *video, NSError *error) {
      if (!video.available) {
        return;
      }
      NSMutableDictionary *dic = [PolyvRNVodDownloadModule formatDefinition:video.qualityCount];
      resolve(dic);
    }];
  }
}

RCT_EXPORT_METHOD(startDownload:(NSString *)vid
                  bitrate:(int)bitrate
                  title:(NSString *)title
                  findEventsWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )
{
  NSLog(@"startDownload() - %@ 、 %d 、 %@", vid, bitrate, title);
  
  [PLVVodVideo requestVideoPriorityCacheWithVid:vid completion:^(PLVVodVideo *video, NSError *error) {
    if (error) {
      NSString *errorDesc = error.description;
      if (!errorDesc) {
        errorDesc = @"获取下载信息失败";
      }
      NSInteger errorCode = -1004;
      NSError *errorObject = [NSError errorWithDomain:NSURLErrorDomain code:errorCode userInfo:@{NSLocalizedDescriptionKey:errorDesc}];
      NSLog(@"%@", errorDesc);
      reject([@(errorCode) stringValue], errorDesc, errorObject);
      return;
    }
    
    PLVVodQuality quality = [PolyvRNVodDownloadModule getQuality:bitrate];
    PLVVodDownloadManager *downloadManager = [PLVVodDownloadManager sharedManager];
    PLVVodDownloadInfo *info = [downloadManager downloadVideo:video quality:quality];
    if (info) {
      NSLog(@"%@ - %zd 已加入下载队列", info.video.vid, info.quality);
      [self addDownloadInfoListener:info];
    } else { // 视频已存在，无法重新下载
      NSString *errorDesc = @"下载任务已经增加到队列";
      NSInteger errorCode = -1005;
      NSError *errorObject = [NSError errorWithDomain:NSURLErrorDomain code:errorCode userInfo:@{NSLocalizedDescriptionKey:errorDesc}];
      NSLog(@"%@", errorDesc);
      reject([@(errorCode) stringValue], errorDesc, errorObject);
    }
  }];
}

RCT_EXPORT_METHOD(getDownloadVideoList:(BOOL)hasDownloaded
                  findEventsWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )
{
  
  NSMutableArray *downloadInfoArray = [[NSMutableArray alloc] init];
  
  if (hasDownloaded) { // 已下载列表
    // 从本地文件目录中读取已缓存视频列表
    NSArray<PLVVodLocalVideo *> *localArray = [[PLVVodDownloadManager sharedManager] localVideos];

    // 从数据库中读取已缓存视频详细信息
    // 也可以从开发者自定义数据库中读取数据,方便扩展
    NSArray<PLVVodDownloadInfo *> *dbInfos = [[PLVVodDownloadManager sharedManager] requestDownloadCompleteList];
    NSMutableDictionary *dbCachedDics = [[NSMutableDictionary alloc] init];
    [dbInfos enumerateObjectsUsingBlock:^(PLVVodDownloadInfo * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
      [dbCachedDics setObject:obj forKey:obj.vid];
    }];

    // 组装数据
    // 以本地目录数据为准，因为数据库存在损坏的情形，会丢失数据，造成用户已缓存视频无法读取
    [localArray enumerateObjectsUsingBlock:^(PLVVodLocalVideo * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
      PLVVodDownloadInfo *downloadInfo = dbCachedDics[obj.vid];
      NSDictionary *downloadInfoDic = [PolyvRNVodDownloadModule formatDownloadInfoToDictionary:downloadInfo];
      [downloadInfoArray addObject:downloadInfoDic];
    }];
    
  } else { // 下载中列表
    PLVVodDownloadManager *downloadManager = [PLVVodDownloadManager sharedManager];
    [downloadManager requstDownloadProcessingListWithCompletion:^(NSArray<PLVVodDownloadInfo *> *downloadInfos) {
      for (PLVVodDownloadInfo *info in downloadInfos) {
        NSDictionary *dic = [PolyvRNVodDownloadModule formatDownloadInfoToDictionary:info];
        [downloadInfoArray addObject:dic];
        
        [self addDownloadInfoListener:info];
      }
    }];
  }
  
  NSString *downloadInfoArrayDesc;
  if (downloadInfoArray.count == 0) {
    downloadInfoArrayDesc = @"[]";
  } else {
    NSError *error = nil;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:downloadInfoArray options:kNilOptions error:&error];
    downloadInfoArrayDesc = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
  }
  NSLog(@"downloadInfoArrayDesc = %@", downloadInfoArrayDesc);
  NSDictionary *dic = @{ @"downloadList": downloadInfoArrayDesc };
  resolve(dic);
}

RCT_EXPORT_METHOD(getDownloadStatus:(NSString *)vid
                  bitrate:(int)bitrate
                  findEventsWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  PLVVodDownloadInfo *info = [[PLVVodDownloadManager sharedManager] requestDownloadInfoWithVid:vid];
  int status = -1;
  switch (info.state) {
    case PLVVodDownloadStatePreparing:
    case PLVVodDownloadStateReady:
    {
      status = 2;
    }break;
    case PLVVodDownloadStateStopped:
    case PLVVodDownloadStateStopping:{
      status = 1;
    }break;
    case PLVVodDownloadStatePreparingStart:
    case PLVVodDownloadStateRunning:{
      status = 0;
    }break;
    default:{
      status = 1;
    }break;
  }
      
  NSDictionary *dic = @{ @"downloadStatus": @(status) };
  resolve(dic);
}

RCT_EXPORT_METHOD(pauseDownload:(NSString *)vid
                  bitrate:(int)bitrate
                  )
{
  NSLog(@"RCT_EXPORT_METHOD pauseDownload");
  [[PLVVodDownloadManager sharedManager] stopDownloadWithVid:vid];
  
}

RCT_EXPORT_METHOD(resumeDownload:(NSString *)vid
                  bitrate:(int)bitrate
                  )
{
  NSLog(@"RCT_EXPORT_METHOD resumeDownload");
  [[PLVVodDownloadManager sharedManager] startDownloadWithVid:vid];
  
}

RCT_EXPORT_METHOD(pauseAllDownload
                  )
{
  [[PLVVodDownloadManager sharedManager] stopDownload];
  
}

RCT_EXPORT_METHOD(startAllDownload
                  )
{
  [[PLVVodDownloadManager sharedManager] startDownload];
  
}

RCT_EXPORT_METHOD(deleteDownload:(NSString *)vid
                  bitrate:(int)bitrate
                  )
{
  NSError *error;
  [[PLVVodDownloadManager sharedManager] removeDownloadWithVid:vid error:&error];
  
}

RCT_EXPORT_METHOD(deleteAllDownload
                  )
{
  [[PLVVodDownloadManager sharedManager] removeAllDownloadWithComplete:^(void *result) {
    
  }];
}

#pragma mark -- add listener
- (void)addDownloadInfoListener:(PLVVodDownloadInfo *)info
{
  // 下载状态改变回调
  info.stateDidChangeBlock = ^(PLVVodDownloadInfo *info) {
    dispatch_async(dispatch_get_main_queue(), ^{

      switch (info.state) {
        case PLVVodDownloadStatePreparing:
        case PLVVodDownloadStateReady:
        case PLVVodDownloadStateStopped:
        case PLVVodDownloadStateStopping:{
          [self sentEvnetWithKey:pauseDownloadEvent info:info];
        }break;
        case PLVVodDownloadStatePreparingStart:
        case PLVVodDownloadStateRunning:{
          [self sentEvnetWithKey:startDownloadEvent info:info];
        }break;
        case PLVVodDownloadStateSuccess:{
          [self sentEvnetWithKey:downloadSuccessEvent info:info];
        }break;
        case PLVVodDownloadStateFailed:{
          [self sentEvnetWithKey:downloadFailedEvent info:info];
        }break;
      }
    });
  };

  // 下载进度回调
  info.progressDidChangeBlock = ^(PLVVodDownloadInfo *info) {
    //NSLog(@"vid: %@, progress: %f", info.vid, info.progress);
    float receivedSize = info.progress * info.filesize;
    if (receivedSize >= info.filesize){
      receivedSize = info.filesize;
    }
    NSMutableDictionary *downloadInfoDic = [PolyvRNVodDownloadModule formatDownloadInfoToDictionary:info];
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:downloadInfoDic options:0 error:nil];
    NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    NSString *downloadInfoDicString = [jsonString stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]];
    
    NSMutableDictionary *dic = [[NSMutableDictionary alloc] init];
    dic[@"progress"] = @(info.progress);
    dic[@"downloadInfo"] = downloadInfoDicString;
    [self sentEvnetWithKey:updateProgressEvent body:dic];
  };

  // 下载速率回调
  info.bytesPerSecondsDidChangeBlock = ^(PLVVodDownloadInfo *info) {
    NSMutableDictionary *dic = [PolyvRNVodDownloadModule formatDownloadInfoToDictionary:info];
    dic[@"downloadSpeed"] = @(info.bytesPerSeconds);
    [self sentEvnetWithKey:downloadSpeedEvent body:dic];
  };

}

#pragma mark -- private method
+ (NSMutableDictionary *)formatDefinition:(int)count {
  NSMutableDictionary *dic = [[NSMutableDictionary alloc] init];
  dic[@"流畅"] = @(1);
  if (count >= 2) {
    dic[@"高清"] = @(2);
    if (count >= 3) {
      dic[@"超清"] = @(3);
    }
  }
  return dic;
}

+ (PLVVodQuality)getQuality:(int)bitrate {
  switch (bitrate) {
    case 1:
      return PLVVodQualityStandard;
    case 2:
      return PLVVodQualityHigh;
    case 3:
      return PLVVodQualityUltra;
    default:
      return PLVVodQualityStandard;
  }
}

+ (NSMutableDictionary *)formatDownloadInfoToDictionary:(PLVVodDownloadInfo *)info {
  NSMutableDictionary *dic = [[NSMutableDictionary alloc] init];
  dic[@"vid"] = info.vid;
  dic[@"duration"] = @(info.duration);
  dic[@"bitrate"] = @(info.quality);
  dic[@"title"] = info.title;
  dic[@"progress"] = @(info.progress);
  dic[@"filesize"] = @(info.filesize);
  return dic;
}

- (void)sentEvnetWithKey:(NSString *)name body:(NSDictionary *)body {
  [_bridge enqueueJSCall:@"RCTNativeAppEventEmitter"
                  method:@"emit"
                    args:body ? @[name, body] : @[name]
              completion:NULL];
}

- (void)sentEvnetWithKey:(NSString *)key info:(PLVVodDownloadInfo *)info {
  NSDictionary *dic = [PolyvRNVodDownloadModule formatDownloadInfoToDictionary:info];
  [self sentEvnetWithKey:key body:dic];
}

@end
