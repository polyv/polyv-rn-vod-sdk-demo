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

    getToken(){
        return token
    },

    isSign(){
        return isSign
    },

    
} 

module.exports = PolyvVodConfig;