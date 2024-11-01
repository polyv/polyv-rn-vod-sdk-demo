## RN 点播集成文档

## 1. 概述

PolyvRNVodDemo 支持 Android + iOS， 是专为 ReactNative 技术开发者定制的点播集成 Demo，具备功能丰富且易用的接口，提供了视频点播播放、视频下载等一系列功能。

### 1.1 支持设备

Android 4.1.0 (API 16) 以上 或 iOS 11.0 以上

### 1.2 接入条件

- 了解 ReactNative 技术；
- 搭建好运行 React Native 的相关环境；
- 准备在使用 React Native 技术开发的项目中接入点播功能；
- 拥有 polyv 官网的直播账号且已开通直播权限。

### 1.3 版本功能

RN 版本是基于原生 demo + sdk 开发的，iOS 与 android 对应版本，及 SDK 版本更新日志链接如下：

- iOS SDK 对应版本为 v2.21.1，[版本更新日志](https://github.com/polyv/polyv-ios-vod-sdk/releases)
- Android SDK 对应版本为 v2.21.2，[版本更新日志](https://github.com/easefun/polyv-android-sdk-2.0-demo/releases)

## 2. 快速开始

### 2.1 RN端集成

#### 2.1.1 安装依赖

执行如下命令下载 react 相关依赖
```js
npm install
```

#### 2.1.2 引入插件

点播的插件和 demo 使用到的插件的目录结构如下所示：

```
├── polyv
│   ├── demo
│   │   ├── PolyvNavigation.js
│   │   ├── PolyvUserConfig.js
│   │   ├── common
│   │   ├── downloadList
│   │   ├── img
│   │   ├── onlineList
│   │   └── player
│   └── sdk
│       ├── PolyvVodConfigModule.js
│       ├── PolyvVodDownloadModule.js
│       ├── PolyvVodDownloadResultCode.js
│       └── PolyvVodPlayerModule.js
```

在目录 sdk 下我们的 RN 点播 SDK 提供了一下三大功能模块：

| 文件名    | 描述   |
| -------- | ------ |
| PolyvVodConfigRnModule |  初始化模块    |
| PolyvVodPlayerModule |  播放器模块    |
| PolyvVodDownloadModule  |  视频下载模块   |

如果只是需要使用到 sdk 的功能，把 sdk 目录下的文件拉到 RN 项目中即可。demo 中的功能则需要使用到 demo 目录下的文件。

#### 2.1.3 项目配置

1. 项目中app.json中的字段需要与native 层的入口名对应，所以在Android与ios两端需要做入口名统一配置。配置文件名：

   - Android端的MainActivity.java 文件

     ```java
      @Override
         protected String getMainComponentName() {
             return "此处填入app.json里的name字段内容";
         }
     ```

   - IOS端的AppDelegate.m文件

     ```objective-c
     - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
     {
       NSURL *jsCodeLocation;
     
       jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
     
       RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                           moduleName:@"此处填入app.json里的name字段内容"
                                                    initialProperties:nil
                                                        launchOptions:launchOptions];
      .... 此处代码省略...
       
       return YES;
     }
     ```



2. 在 package.json 文件中配置依赖。

```json
  "dependencies": {
    "@react-navigation/material-top-tabs": "^6.6.13",
    "@react-navigation/native": "^6.1.17",
    "@react-navigation/stack": "^6.3.29",
    "axios": "^0.18.0",
    "native-base": "^3.4.12",
    "react": "18.2.0",
    "react-native": "0.71.8",
    "react-native-gesture-handler": "^2.16.0",
    "react-native-pager-view": "^6.3.0",
    "react-native-safe-area-context": "^4.9.0",
    "react-native-screens": "^3.30.1",
    "react-native-svg": "^14.1.0",
    "react-native-tab-view": "^3.5.2"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@babel/preset-env": "^7.20.0",
    "@babel/runtime": "^7.20.0",
    "@react-native-community/eslint-config": "^3.2.0",
    "@tsconfig/react-native": "^2.0.2",
    "@types/jest": "^29.2.1",
    "@types/react": "^18.0.24",
    "@types/react-test-renderer": "^18.0.0",
    "babel-jest": "^29.2.1",
    "eslint": "^8.19.0",
    "jest": "^29.2.1",
    "metro-react-native-babel-preset": "0.73.9",
    "prettier": "^2.4.1",
    "react-test-renderer": "18.2.0",
    "typescript": "4.8.4"
  },
```

#### 2.1.4 使用方法
##### 2.1.4.1 初始化

初始化的方法要放在界面渲染前初始化， 一般在 componentWillMount 调用该方法进行初始化.

0.4.0起建议使用初始化方法`setToken`，该方法是一个异步有返回结果的函数。推荐使用 https 接口，从服务端获取加密串，APP 本地解密（开发者设计自己的加解密方式）得到 `useId`、`readtoken`、`writetoken`、`secretkey` ，再使用该方法配置用户信息。

低于0.4.0的可以使用`init`方法初始化，他也是异步有返回结果的函数。

```javascript
 /*
   * @param {string} userid 保利威后台API接口userid
   * @param {*} writetoken 保利威后台API接口writetoken
   * @param {*} readtoken 保利威后台API接口readtoken
   * @param {*} secretkey 保利威后台API接口secretkey
   * @param {*} viewerId 用户ID
   * @param {*} nickName 用户昵称
   */
PolyvVodConfig.setToken(
        this.state.userid,
        this.state.writetoken,
        this.state.readtoken,
        this.state.secretkey,
        this.state.viewerId,
        this.state.nickName
    ).then(ret =>{
        if(ret.code != 0){
            //初始化失败
            var str = "初始化失败  errCode=" + ret.code + "  errMsg=" + ret.message;
            console.log(str);
            alert(str);
        } else {
            // 初始化成功
            console.log("初始化成功");
        }
    });

 /**
   * @param {string} vodKey 加密串
   * @param {*} decodeKey 加密密钥
   * @param {*} decodeIv 加密向量
   * @param {*} viewerId 用户ID
   * @param {*} nickName 用户昵称
   */
   console.log("Polyv rn vod init")
   PolyvVodConfigRnModule.init(this.state.vodKey, this.state.decodeKey, this.state.decodeIv, this.state.viewerId, this.state.nickName)
     .then(ret => {
       if (ret.code != 0) { // 初始化失败
         var str = "初始化失败  errCode=" + ret.code + "  errMsg=" + ret.message
         console.log(str)
         alert(str)
       } else { // 初始化成功
         console.log("初始化成功")
       }
     })
```



##### 2.1.4.2 视频播放

```javascript

//使用方式
<PolyvVodPlayer
          ref='playerA'
          style={styles.video}
          vid={"e97dbe3e64cb3adef1a27a42fe49228e_e"}//视频播放vid
          isAutoStart={true}//是否自动播放
					fullScreen={false}
          marquee={{
            displayDuration:8,//单位：秒  单次跑马灯显示时长
            maxRollInterval:1,//单位：秒  两次滚动的最大间隔时长，实际的间隔时长是取 0~maxRollInterval 的随机值
            content:'我是跑马灯',//跑马灯内容
            color:'#0000FF',//跑马灯颜色
            alpha:0.5,//跑马灯透明度
            font:20,//跑马灯字体
          }}
        />
```



##### 2.1.4.3 视频下载

视频下载模块组件 PolyvVodDownloadModule.js 提供了如下接口：

| 函数名            | 参数        | 功能说明         | 是否有返回值 |
| :---------------- | ----------- | ---------------- | ------------ |
| getBitrateNumbers | vid：视频id | 获取视频码率列表 | 是           |
| startDownload     | vid：视频id<br>bitrate：码率索引<br>title：下载标题 | 开始下载视频 | 是 |
| pauseDownload | vid：视频id<br/>bitrate：码率索引 | 暂停下载 | 否 |
| pauseAllDownload | 无 | 暂停所有下载视频 | 否 |
| resumeDownload | vid：视频id<br/>bitrate：码率索引 | 恢复下载视频 | 否 |
| startAllDownload | 无 | 开始下载所有视频，未下载视频全部放入等待队列 | 否 |
| deleteDownload | vid：视频id<br/>bitrate：码率索引 | 删除视频 | 否 |
| deleteAllDownload | 无 | 删除所有未下载的视频 | 否 |
| getDownloadVideoList | hasDownloaded：是否获取已下载视频 | 获取下载列表 | 是 |

下载数据 downloadInfo 结构说明

| 参数     | 类型   | 说明            |
| -------- | ------ | --------------- |
| vid      | string | 视频id          |
| duration | string | 视频时长        |
| filesize | number | 文件大小        |
| bitrate  | number | 码率索引        |
| title    | string | 文件标题        |
| progress | number | 下载进度（0~1） |

下载视频的进度更新需要添加监听器，一般装载组件的时候添加监听器，卸载的时候移除。下载视频的回调是通过 DeviceEventEmitter 的方式实现对 native 的监听

对应的回掉 event 事件列表，该事件列表对应 native 层相应的通知事件

| event                | 返回值结构                                                | 说明           |
| -------------------- | --------------------------------------------------------- | -------------- |
| startDownloadEvent   | {downloadInfo：{对应上述的downloadInfo结构}}              | 开始下载的回掉 |
| updateProgressEvent  | {downloadInfo：{对应上述的downloadInfo结构},progress:0.2} | 下载更新回掉   |
| downloadSuccessEvent | {bitrate:1,vid:'123'}                                     | 下载完成回掉   |
| downloadFailedEvent  | {bitrate:1,vid:'123'}                                     | 下载失败回掉   |
| downloadSpeedEvent   | {bitrate:1,vid:'123',downloadSpeed:123.5}                 | 下载速度回掉   |

RN 端实现监听的代码演示：

```javascript
 componentWillMount() {
    this.registerReceiver();
  }

  componentWillUnmount() {
    console.log("download list componentWillUnmount");
    DeviceEventEmitter.removeAllListeners();
  }
  
  //注册下载进度回调监听
  registerReceiver() {
    console.log("registerReceiver:" + this.props.isDownloadedPage);
    if (this.props.isDownloadedPage) {
      return;
    }
    //下载开始回调
    DeviceEventEmitter.addListener("startDownloadEvent", msg => {
      console.log("startDownload" + msg);
      // this.setState({ downloadingInfo: msg.downloadInfo });
    });

    //下载失败回调
    DeviceEventEmitter.addListener("downloadFailedEvent", msg => {
      console.log("downloadFailedEvent" + JSON.stringify(msg));
    });

    //下载速度回调
    DeviceEventEmitter.addListener("downloadSpeedEvent", msg => {
     
    });
    //进度更新回调
    DeviceEventEmitter.addListener("updateProgressEvent", msg => {

    });

    //下载完成回调
    DeviceEventEmitter.addListener("downloadSuccessEvent", msg => {
      
    });
  }
```

###  2.2 Android 端集成

#### 2.2.1 Android 端工程说明

Android 端工程的原生插件代码分为两个部分：

- 定制的 rn 模块，就是工程的主模块app，路径是PolyvVodRnDemo/android/app。
- polyv sdk 模块，主要是 polyv 相关组件的代码文件，路径是PolyvVodRnDemo/android/polyvsdk。

主模块app涉及的 java 文件有：
- PolyvRNVodPluginManager：rn 插件开发的管理类，用来注册相关的 rn 定制组件。
- PolyvRNVodConfigModule：初始化组件模块，用来初始化 android 端需要的一些全局用户信息，例如 iv，secreate，userid。
- PolyvVodPlayer：播放器的 rn 组件，封装了播放器功能。
- PolyvRNVodPlayer：播放器及其皮肤的自定义控件，用于 rn 组件进行整合及使用。
- PolyvRNVodDownloadModule：视频下载组件。

####  2.2.2 代码集成步骤

1. 集成 polyvsdk 模块

   1. 把Demo项目的 android/polyvsdk文件夹 拷贝到 目标工程的 android目录 下面；

   2. 配置目标工程 android/settings.gradle文件 的依赖

      ```java
      rootProject.name = 'XXXXXXX'//对应目标rn工程app.json下的name
      include ':app'
      
      include ':polyvsdk'  //polyvsdk模块的依赖配置  新增加的一行！
      ```

   3. 配置目标工程 android/app/build.gradle文件 的依赖

      ```java
      dependencies {
          implementation fileTree(dir: "libs", include: ["*.jar"])
          implementation ("com.facebook.react:react-native:+"){
              exclude group:'com.android.support',module:'appcompat-v7'
          }
          implementation 'com.android.support:multidex:1.0.1'//64K 引用限制
            
          implementation project(path: ':polyvsdk')  //polyvsdk模块的依赖配置   新增加的一行！
      }
      ```

2. 集成app代码

   1. 在目标工程中的 android/app/src/main/java 目录下，增加 com 目录，形成 android/app/src/main/java/com 的目录结构（如果已有com目录，可跳过本步骤）；

   2. 把 android/app/src/main/java/com/polyv文件夹 拷贝到 上面创建的 com目录 下；

   3. 配置目标项目的 Application文件；

      ```java
              @Override
              protected List<ReactPackage> getPackages() {
                  return Arrays.<ReactPackage>asList(
                          new MainReactPackage()
                          , new PolyvRNVodPluginManager()  // 新增加的一行！
                  );
              }
      ```

      4.MainActivity配置

      ```java
      @Override
              protected List<ReactPackage> getPackages() {
                  return Arrays.<ReactPackage>asList(
                          new MainReactPackage()
                          , new PolyvRNVodPluginManager()//新增加的一行！
                    		
                  );
              }
      ```

3. 集成react-native-gesture-handler插件（如果RN端没有集成react-native-gesture-handler，可跳过本步骤）

   1. 配置目标工程 android/settings.gradle文件 的依赖

      ```java
      rootProject.name = 'PolyvVodRnDemo'
      include ':app'
        
      include ':polyvsdk'  //polyvsdk模块的依赖配置
      
      //react-native-gesture-handler模块的依赖配置  以下是新增加的部分
      include ':react-native-gesture-handler'
      project(':react-native-gesture-handler').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-gesture-handler/android')
      ```

   2. 配置目标工程 android/app/build.gradle文件 的依赖

      ```java
      dependencies {
          implementation fileTree(dir: "libs", include: ["*.jar"])
          implementation ("com.facebook.react:react-native:+"){
              exclude group:'com.android.support',module:'appcompat-v7'
          }
          implementation 'com.android.support:multidex:1.0.1'//64K 引用限制
          
          implementation project(path: ':polyvsdk')
            
          implementation project(':react-native-gesture-handler')    //新增加的一行！
      }
      ```

   3. 配置MainActivity

      ```java
              @Override
              protected List<ReactPackage> getPackages() {
                  return Arrays.<ReactPackage>asList(
                          new MainReactPackage()
                          , new PolyvRNVodPluginManager()
                    			, new RNGestureHandlerPackage()  //新增加的一行！
                  );
              }
      ```

###   2.3 iOS 端集成

#### 2.3.1 iOS端工程说明

iOS 端工程的原生插件代码全部包含在  ios/PolyvVodRnModule文件夹 中；

#### 2.3.2 代码集成

1. 引入原生代码

   1）把Demo项目的 ios/PolyvVodRnModule文件夹 拷贝到 目标项目的 ios 目录下（如果以前已经拷贝过上述文件夹，需要在XCode先删除，然后再拷贝）；

   2）在XCode中，把上述文件夹增加（Add Files）到项目中；

2. 配置CocoaPods

   1）如果目标项目原来没有  ios/Podfile 文件，需要拷贝 demo 项目的 ios/Podfile 文件到 目标项目的 ios 目录下；打开 Podfile 文件，把其中 ‘PolyvVodRnDemo’ 改为 ‘自身项目名’；

   2）如果目标项目原来有Podfile 文件，只需要把 Polyv vod rn sdk 所需要的配置拷贝到  ios/Podfile文件 中；

   3）在命令行环境进入ios 目录，添加点播SDK，执行 pod install 命令；

   ```java
     # Polyv vod rn sdk
     pod 'XRCarouselView', '~> 2.6.1'
     pod 'YYWebImage', '~> 1.0.5'
     pod 'FDStackView', '~> 1.0.1'
     pod 'PLVMasonry', '~> 1.1.2'
   
     # Polyv vod rn sdk 2.13.1
   #  pod 'PolyvVodSDK', '2.13.1'
   
     # Polyv vod rn sdk 2.21.1
     pod 'PLVAliHttpDNS', '~> 1.10.0'
     pod 'SSZipArchive', '~> 2.1.5'
     pod 'PolyvVodSDK', '2.21.1', :subspecs => ['Core','Player']
   
     pod 'PLVVodDanmu', '~> 0.0.1'
     pod 'PLVSubtitle', '~> 0.1.0'
   ```
