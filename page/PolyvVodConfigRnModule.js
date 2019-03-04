'use strict';

import { NativeModules } from 'react-native';

/**
 * code，返回码定义：
 *      0  成功
 *      -1 vodKey为空
 *      -2 decodeKey为空
 *      -3 decodeIv为空
 *      -4 UserId为空
 */

const PolyvVodConfigRnModule = {
    //初始化
    async init (vodKey, decodeKey, decodeIv, viewerId, nickName){
        console.log("config_{vodKey}_{decodeKey}_{decodeIv}")
        try {
            await NativeModules.PolyvVodConfigRnModule.init(vodKey, decodeKey, decodeIv, viewerId, nickName)
            return { "code":0 }
        } catch (e) {
            var code = e.code;
            var message = e.message;
            return { code, message }
        }
    }
} 

module.exports = PolyvVodConfigRnModule;