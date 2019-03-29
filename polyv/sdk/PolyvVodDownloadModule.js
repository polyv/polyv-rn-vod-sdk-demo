import { NativeModules } from "react-native";
import PolyvVodDownloadResultCode from "./PolyvVodDownloadResultCode";

const videoDownload = NativeModules.PolyvRNVodDownloadModule;

const PolyvVideoDownload = {

  /**
   * code，返回码定义：
   *      0  成功
   *      -1 vid为空
   *      -2 码率索引不对
   */
  _validate(vid, bitrate) {
    if (!vid) {
      return PolyvVodDownloadResultCode.VID_ERROR;
    }
    if (bitrate < 0) {
      return PolyvVodDownloadResultCode.BITRATE_INDEX_ERROR;
    }

    return PolyvVodDownloadResultCode.SUCCESS;
  },

  /**
   *获取视频码率
   * @param {string} vid 视频id
   */
  async getBitrateNumbers(vid) {
    var result = this._validate(vid);
    if (result != PolyvVodDownloadResultCode.SUCCESS) {
      return { code: result };
    }
    try {
      var bitrates = await videoDownload.getBitrateNumbers(vid);
      return { code: PolyvVodDownloadResultCode.SUCCESS, bitrates:bitrates };
    } catch (error) {
      result = error.code;
    }
    return { code: result };
  },

  /**
   * 
   * @param {string} vid 视频vid
   * @param {int} bitrate 码率   1:流畅  2:高清   3:超清
   * @param {string} title 下载标题
   * @returns 0:下载任务添加成功，1：下载任务已经在队列
   */
  async startDownload(vid, bitrate, title) {
    var result = this._validate(vid, bitrate);
    if (result != PolyvVodDownloadResultCode.SUCCESS) {
      return { code: result };
    }
    try {
      await videoDownload.startDownload(vid, bitrate, title);
      result = PolyvVodDownloadResultCode.SUCCESS;
    } catch (error) {
      result = error.code;
    }
    return { code: result };
  },

  /**
   * 暂停下载
   * @param {string} vid 视频vid
   * @param {string} bitrate 码率
   */
  pauseDownload(vid, bitrate) {
    var result = this._validate(vid, bitrate);
    if (result != PolyvVodDownloadResultCode.SUCCESS) {
      return result;
    }
    videoDownload.pauseDownload(vid, bitrate);
    return result;
  },

  /**
   * 暂停所有下载
   */
  pauseAllDownload() {
    videoDownload.pauseAllDownload();
  },

  /**
   * 恢复下载
   * @param {string} vid 视频vid
   * * @param {string} bitrate 码率
   */
  resumeDownload(vid, bitrate) {
    var result = this._validate(vid, bitrate);
    if (result != PolyvVodDownloadResultCode.SUCCESS) {
      return result;
    }
    videoDownload.resumeDownload(vid, bitrate);
    return result;
  },

  /**
   * 下载所有队列里的视频
   */
  startAllDownload() {
    videoDownload.startAllDownload();
  },

  /**
   * 删除视频
   * Android 是根据位置删除  ios 是根据vid 删除
   * @param {string} vid 视频id
   * @param {number} bitrate 视频码率
   */
  deleteDownload(vid, bitrate) {
    var result = this._validate(vid, bitrate);
    if (result != PolyvVodDownloadResultCode.SUCCESS) {
      return result;
    }
    videoDownload.deleteDownload(vid, bitrate);
    return result;
  },

  /**
   * 清楚所有下载得视频
   */
  deleteAllDownload() {
    videoDownload.deleteAllDownload();
  },

  /**
   * 获取下载列表
   * @param {bool} hasDownloaded true：已下载列表   false：下载中列表
   */
  async getDownloadVideoList(hasDownloaded) {
    try {
      var { downloadList } = await videoDownload.getDownloadVideoList(hasDownloaded);
      var dataMaps = new Map();
      var dataJs = JSON.parse(downloadList);
      if (!hasDownloaded) {
        //正在下载中的创建map映射
        dataJs.forEach(element => {
          var key = element.vid + element.bitrate;
          dataMaps.set(key, element);
        });
      }
      return { code: 0, data: dataJs, dataMaps: dataMaps };
    } catch (e) {
      var code = e.code;
      var message = e.message;
      return { code, message };
    }
  },

  /**
   *
   * @param {stirng} vid 视频id
   * @param {string} bitrate 码率选项
   * return 返回下载状态   0：下载中   1：下载暂停   2：下载等待
   *
   * -1：状态获取失败
   */
  async getDownloadStatus(vid, bitrate) {
    try {
      var { downloadStatus } = await videoDownload.getDownloadStatus(vid, bitrate);
      return { code: downloadStatus };
    } catch (error) {
      return { code: PolyvVodDownloadResultCode.DOWNLOAD_STATUS_ERROR };
    }
  },

 
};

module.exports = PolyvVideoDownload;
