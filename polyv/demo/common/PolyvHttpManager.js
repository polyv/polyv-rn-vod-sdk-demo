import Axios from "axios";
import PolyvVodConfig from '../../sdk/PolyvVodConfigModule'

const HttpManager ={

    getVideoList(num,size,callback){

        var token = PolyvVodConfig.getToken
        var isSign = PolyvVodConfig.isSign

        var sign=''
        console.log('sign :'+sign+' token :'+token())
        if(isSign){
            //如果需要  计算sha值
        }

        Axios.get('http://v.polyv.net/uc/services/rest?method=getNewList',{
            params:{
                readtoken:token(),
                pageNum:num,
                numPerPage:size,
                sign:sign
            }
        }).then(ret =>{
            console.log(' request is success '+ret)
            callback(ret)
        })
        .catch(error =>{
            console.log(' request is error '+error)
        })
    },

    getVideoInfo(vid,callback){
        Axios.get(`https://player.polyv.net/videojson/${vid}.json`)
        .then(ret =>{
            console.log(' getVideoInfo is success '+ret)
            callback(ret)
        }).catch(error =>{
            console.log(' getVideoInfo is error '+error)
        })
    }
}
module.exports= HttpManager