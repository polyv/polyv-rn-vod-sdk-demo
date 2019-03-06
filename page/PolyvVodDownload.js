import React, { Component } from "react";
import { NativeModules } from 'react-native';

const videoDownload = NativeModules.PolyvRNVodDownloadModule

const PolyvVideoDownload = {

/**
 * 
 * @param {string} vid 视频vid 
 * @param {string} url 下载连接 
 * @param {fun} callback 下载回掉
 * @returns 0:下载任务添加成功，1：下载任务已经在队列
 */
  startDownload(vid,url,callback) {

    var result ;
    try {
        await videoDownload.startDownload(url,callback)
        result = 0
    } catch (error) {
        result = error.code
    }
    return result

  },

  /**
   * 暂停下载
   * @param {string} vid 视频vid
   */
    pauseDownload(vid){

    },

    pauseAllDownloadTask(){

    },

    /**
     * 恢复下载
     * @param {string} vid 视频vid 
     */
    resumeDownload(vid){

    },

    /**
     * 下载所有队列里的视频
     */
    downloadAllTask(){

    },

    /**
     * 删除视频
     * Android 是根据位置删除  ios 是根据vid 删除
     * @param {string} pos 列表中item位置 
     */
    delVideo(pos){

    },
     /**
     * 删除视频
     * Android 是根据位置删除  ios 是根据vid 删除
     * @param {string} vid 视频vid状态
     */
    delVideo(vid){

    },

    clearDownloadVideo(){

    }

};
module.exports = PolyvVideoDownload;
