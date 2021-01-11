'use strict';

import { NativeModules } from 'react-native';

/**
 * code，返回码定义：
 *      0  成功
 *      -1 vodKey为空
 *      -2 decodeKey为空
 *      -3 decodeIv为空
 *      -4 ViewerId为空
 *      -5 解析数据错误
 *      -6 没有正在下载的视频
 *      -7 userid为空
 *      -8 writeToken为空
 *      -9 readToken为空
 *      -10 secretkey为空
 */
let token ,isSign

const PolyvRNVodConfigNativeModule = NativeModules.PolyvRNVodConfigModule

const PolyvVodConfig = {

    //初始化
    async init (vodKey, decodeKey, decodeIv, viewerId, nickName){
        console.log(`config_${vodKey}_${decodeKey}_${decodeIv}`)
        try {
            PolyvRNVodConfigNativeModule.init(vodKey, decodeKey, decodeIv, viewerId, nickName)
            .then(ret =>{
                console.log('result :token:'+ret.token+"  isSign:"+ret.isSign)
                token = ret.token
                isSign = ret.isSign
            })
            console.log('result end')
            return { "code":0 }
        } catch (e) {
            var code = e.code;
            var message = e.message;
            return { code, message }
        }
    },

    async setToken(userId, writeToken, readToken, secretkey, viewerId, nickName){
        console.log(`setToken_${userId}_${viewerId}_${nickName}`)
        try{
            PolyvRNVodConfigNativeModule.setToken(userId, writeToken, readToken, secretkey, viewerId, nickName)
                .then(ret =>{
                    console.log('result :token:'+ret.token+"  isSign:"+ret.isSign)
                    token = ret.token
                    isSign = ret.isSign
                })
            console.log('result end')
            return { "code":0 }
        } catch(e){
            var code = e.code;
            var message = e.message;
            return { code, message }
        }
    },

    getToken(){
        return token
    },

    isSign(){
        return isSign
    },


}

module.exports = PolyvVodConfig;
