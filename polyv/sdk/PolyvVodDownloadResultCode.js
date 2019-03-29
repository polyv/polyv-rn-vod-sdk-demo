//错误代码
const PolyvVodDownloadResultCode = {
  SUCCESS: 0,
  VID_ERROR: -1, //vid错误
  BITRATE_INDEX_ERROR: -2, //码率错误
  DOWNLOAD_STATUS_ERROR: -3, //下载状态码返回错误
  DOWNLOAD_INFO_ERROR: -1004, //下载数据获取失败
  DOWNLOAD_EXIST: -1005, //下载任务已存在

  getErrorDes(errorCode) {
    var errorDes = "";
    switch (errorCode) {
      case this.VID_ERROR:
        errorDes = "vid is error";
        break;
      case this.BITRATE_INDEX_ERROR:
        errorDes = "bitrate is error";
        break;
      case this.DOWNLOAD_EXIST:
        errorDes = "download task is exits";
        break;
    }

    return errorDes;
  }
};

module.exports = PolyvVodDownloadResultCode;
