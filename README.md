### RN点播集成文档

### 概述

PolyvRNVodDemo是为ReactNative技术开发者定制的点播集成Demo，展示了点播播放器与皮肤相关功能。

### 阅读对象

本文档为技术文档，需要阅读者：

- 了解React native技术并准备使用该技术接入点播功能的开发者。

### 开发准备

#### 开发设备及系统

- 设备要求：搭载 Android 、iOS系统的设备
- 系统要求：Android 4.1.0(API 16) 及其以上、iOS：iOS9

#### 前置条件

- 账号要求：需要有polyv官方的直播账号

- 通过官网申请并已开通直播权限


#### 快速开始

#####   React端集成步骤

开始运行行执行如下命令下载react 相关依赖

```js
npm install
```

对应的native端的注册入口标签名为：‘PolyvVodRnDemo’   对应到app.json文件里的配置

```java
{
  "name": "PolyvVodRnDemo",
  "displayName": "PolyvVodRnDemo"
}
```

封装的js文件包括：PolyvVodConfigRnModule.js 和 PolyvVodPlayer.js

```javascript
PolyvVodConfigRnModule.js：初始化模块的中间件。

//引入方式
import PolyvVodConfigRnModule from './page/PolyvVodConfigRnModule'

//该模块提供了初始化的方法init，该方法是一个异步有返回结果的函数
/**
 * code，返回码定义：
 *      0  成功
 *      -1 vodKey为空
 *      -2 decodeKey为空
 *      -3 decodeIv为空
 *      -4 ViewId为空
 */
 
//使用方式
/**
 * <Polyv Live init/>
 初始化的方法要放在界面渲染前初始化 一般在componentWillMount 调用该方法进行初始化
 */
console.log("Polyv vod init")
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

```java
PolyvVodPlayer.js：播放器模块的中间件。

//引入方式：
import PolyvVodPlayer from './page/PolyvVodPlayer';

//使用方式
<PolyvVodPlayer
          ref='playerA'
          style={styles.video}
          vid={"e97dbe3e64cb3adef1a27a42fe49228e_e"}
          isAutoStart={true}
        />
```

#####    Android端集成步骤

Android端工程由两部分构成，一部分是定制的rn模块，也是工程的主模块（app），另外是polyvsdk模块，主要是polyv相关的组件代码文件。这样用户可以比较方便的更换依赖模块进行定制。

app主工程主要的java文件：PolyvRNVodPluginManager，PolyvVodConfigRnModule，PolyvVodPlayer，PolyvRNVodPlayer

```
PolyvRNVodPluginManager：android端rn插件开发的管理类。用来注册相关的rn定制组件
```

```
PolyvVodConfigRnModule：Android端初始化的rn组件模块。用来初始化android端需要的一些全局用户信息，例如iv，secreate，userid等
```

```
PolyvVodPlayer：Android端播放器的rn组件。封装播放器功能
```

```
PolyvRNVodPlayer：Android端封装的播放器以及皮肤的自定义控件。用于rn组件进行整合及使用
```

######  代码集成

1. 拷贝polyvsdk模块到主工程下

2. 拷贝rn文件夹下的文件到集成项目里

######  配置依赖

1、setting文件的配置依赖

```java
rootProject.name = 'PolyvVodRnDemo'

include ':app', 
//依赖模块配置
':polyvsdk'
```

2、gradle依赖配置

```java
compile project(path: ':polyvsdk')
```



#####   iOS端集成步骤

1. 拷贝相关的Native代码

   拷贝 demo项目的 ios/PolyvVodRnModule文件夹 到 自身项目的 ios 目录下；

2. 集成CocoaPods管理第三方库

   拷贝 demo项目的 ios/Podfile 文件到自身项目的 ios 目录下；

   打开 Podfile 文件，把其中 ‘PolyvVodRnDemo’ 改为 ‘自身项目名’；

   在 ios 目录中打开命令行，执行 pod install 命令；
