import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Text,
  Image,
  ProgressBarAndroid,
  ProgressViewIOS,
  Platform
} from "react-native";
import PropTypes from "prop-types";
import PolyvUtils from "../../common/PolyvUtils";
import PolyvVodDownloadResultCode from "../../../sdk/PolyvVodDownloadResultCode";
import PolyvVideoDownload from "../../../sdk/PolyvVodDownloadModule";

const { width, height } = Dimensions.get("window");
//播放器下载的四种状态:下载(0)，暂停(1),播放(2)，
const videoPlaySrc = [
  { src: require("../../img/polyv_btn_dlpause.png"), status: "正在下载" },
  { src: require("../../img/polyv_btn_download.png"), status: "下载暂停" },
  { src: require("../../img/polyv_btn_download.png"), status: "下载等待" },
  { src: require("../../img/polyv_btn_play.png"), status: "下载完成" }
];
let defaultImg = require("../../img/polyv_pic_demo.png");

export class PolyvVideoDownloadItem extends Component {
  static propTypes = {
    downloadInfo: PropTypes.object,
    isDownloadedPage: PropTypes.bool, //是否下载完成页面,
    ...View.propTypes // 包含默认的View的属性
  };
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.downloadInfo,
      videoStatus: 1, //视频的状态：下载，暂停，下载等待，下载完成
      speed: 0 //下载速度
    };
  }

  
  componentDidMount(){
    if(!this.props.isDownloadedPage){
      this.getDownloadStatus(this.state.data)
    }
  }

  _onLongPress = () => {
    console.log("_onLongPress");
    this.props.onPressItem(this.props.downloadInfo);
  };

  startPlay() {
    var vid = this.props.downloadInfo.vid;
    this.props.nav.navigate("VideoPlayer", { vid: vid });
  }

  pauseOrStartDownload() {
    var vid = this.props.downloadInfo.vid;
    var bitrate = this.props.downloadInfo.bitrate;
    var result
    if (this.state.videoStatus) {
      //暂停
      result = PolyvVideoDownload.resumeDownload(vid, bitrate);
    } else {
      result = PolyvVideoDownload.pauseDownload(vid, bitrate);
    }

    //如果失败弹出提示语
    if (result != PolyvVodDownloadResultCode.SUCCESS) {
      var errorDes = PolyvVodDownloadResultCode.getErrorDes(result)
      alert(errorDes)
    }
  }

  getDownloadStatus(downloadingInfo){
    if (!downloadingInfo) {
      console.log('downloadingInfo video is null')
      return;
    }
    //获取上一个下载视频得下载状态，如果是等待下载就暂停
    PolyvVideoDownload.getDownloadStatus(
      downloadingInfo.vid,
      downloadingInfo.bitrate
    ).then(ret => {
      var downloadStatus = ret.code;
      this.setState({ videoStatus: downloadStatus });
    });
  }

  creatProgressView(videoInfo) {
    return Platform.OS === "ios" ?     
      <ProgressViewIOS 
        styleAttr="Horizontal"
        progress={videoInfo.progress}
        indeterminate={false}
        style={{ flex: 2.5, width: "90%" }}
        color="#2196F3"
        /> 
      :
      <ProgressBarAndroid 
        styleAttr="Horizontal" 
        progress={videoInfo.progress} 
        indeterminate={false} 
        style={{ flex: 2.5, width: "90%" }} 
        color="#2196F3" 
        />;
  }

  render() {
    var videoInfo = this.state.data;
    var showSpeed = this.state.videoStatus == 0
    var progressContent = showSpeed?PolyvUtils.change(this.state.speed)+'/S':(videoInfo.progress == 0
      ? "0KB"
      : PolyvUtils.change(
          (videoInfo.progress) * videoInfo.filesize
        ));
    var progressView = this.creatProgressView(videoInfo)
    let progressLayout = !this.props.isDownloadedPage ? (
      <View style={styles.bottomHorizonContianer}>
        {progressView}
        <Text style={styles.bottom_download_txt}>
          {progressContent}
        </Text>
      </View>
    ) : null;
    var fileSize = PolyvUtils.change(videoInfo.filesize);

    var timeoutId;
    return (
      /**
       * 很诡异   onlongpress 在点击得时候就被触发了  最简单得demo 也是 最后采用这种方式实现长按
       * 测试发现 6.0机器  longpress触发有点奇怪 如果发现onlongpress 调用奇怪 采用注释代码实现
       */
      <TouchableOpacity
        onLongPress={this._onLongPress}

        // onPressIn={() => {
        //   console.log("onPressIn");
        //   timeoutId = setTimeout(() => {
        //     console.log("onlongpress");
        //     this._onLongPress();
        //   }, 5000);
        // }}
        // onPressOut={() => {
        //   console.log("onPressOut");
        //   clearTimeout(timeoutId);
        // }}
      >
        <View style={styles.container}>
          <View style={styles.imgContainer}>
            <Image style={styles.img} source={{ uri: videoInfo.first_image }} defaultSource={defaultImg}/>
            <TouchableOpacity
              style={styles.videoPlayImg}
              onPress={() => {
                if (this.props.isDownloadedPage) {
                  //已经下载
                  this.startPlay();
                } else {
                  this.pauseOrStartDownload();
                  this.setState({ videoStatus: 1 ^ this.state.videoStatus });
                }
              }}
            >
              <Image
                style={styles.videoPlayImg}
                source={
                  this.props.isDownloadedPage
                    ? videoPlaySrc[3].src
                    : videoPlaySrc[this.state.videoStatus].src
                }
              />
            </TouchableOpacity>
          </View>
          <View style={{ width: "100%", flex: 1, backgroundColor: "white" }}>
            <Text style={styles.title}>{videoInfo.title}</Text>
            <View style={styles.bottomContainer}>
              <View style={styles.bottomHorizonContianer}>
                <Text style={styles.bottom_download_status_txt}>
                  {fileSize}
                </Text>
                <Text style={styles.bottom_download_status_txt}>
                  {this.props.isDownloadedPage
                    ? videoPlaySrc[3].status
                    : videoPlaySrc[this.state.videoStatus].status}
                </Text>
              </View>
              {progressLayout}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    width: width,
    margin: 10,
    display: "flex",
    flexDirection: "row"
  },
  imgContainer: {
    width: 100,
    height: 70,
    position: "relative",
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    marginBottom: 5,
    marginLeft: 5,
    display: "flex",
    color: "red",
    fontSize: 15,
    justifyContent: "center",
    alignItems: "center"
  },
  bottomContainer: {
    position: "relative",
    bottom: 0,
    display: "flex",
    flexDirection: "column"
  },
  bottomHorizonContianer: {
    position: "relative",
    marginLeft: 10,
    display: "flex",
    flexDirection: "row"
  },
  bottom_download_status_txt: {
    textAlign: "center",
    borderRadius: 15,
    borderColor: "gray",
    borderWidth: 0.5,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 10,
    backgroundColor: "#fff",
    paddingLeft: 5,
    paddingRight: 5,
    margin: 5
  },
  bottom_download_txt: {
    position: "relative",
    flex: 1,
    textAlign: "center",
    width: 90,

    fontSize: 12,
    height: 20,
    color: "#63B8FF",
    margin: 5
  },
  bottom_play_txt: {
    textAlign: "center",
    width: 60,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 12,
    height: 20,
    backgroundColor: "#63B8FF",
    margin: 5
  },
  img: {
    backgroundColor: "gray",
    resizeMode: "cover",
    width: 100,
    height: 70
  },
  videoPlayImg: {
    height: 30,
    width: 30,
    resizeMode: "cover",
    position: "absolute"
  },
  progress: {}
});
