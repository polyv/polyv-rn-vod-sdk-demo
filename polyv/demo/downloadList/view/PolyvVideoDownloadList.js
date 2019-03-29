import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  DeviceEventEmitter,
  Alert,
  TouchableHighlight
} from "react-native";
import {
  Footer,
  FooterTab,
  Button,
  Text,
} from "native-base";
import PropTypes from "prop-types";
import { PolyvVideoDownloadItem } from "./PolyvVideoDownloadItem";
import PolyvVideoDownload from "../../../sdk/PolyvVodDownloadModule";
import PolyvVodDownloadResultCode from "../../../sdk/PolyvVodDownloadResultCode";


const { width, height } = Dimensions.get("window");

export class PolyvVideoDownloadList extends Component {
  static propTypes = {
    isDownloadedPage: PropTypes.bool, //item的数据
    downloadCallback: PropTypes.func, //下载更新回掉
    ...View.propTypes // 包含默认的View的属性
  };

  constructor(props) {
    super(props);
    this.state = {
      datas: [],
      // downloadingInfosString: [], //正在下载的视频信息串 用于对比 是否重复解析
      downloadingInfos: new Map(), //正在下载的视频,map结构，key为download字符串 value 为download对象
      videoMap: new Map(),
      allTaskDownloadPause: false //下载列表中得  所有列表下载状态
    };
  }

  componentWillMount() {
    this.registerReceiver();
  }

  componentWillUnmount() {
    console.log("download list componentWillUnmount");
    DeviceEventEmitter.removeAllListeners();
    this.refsCollection = {};
  }

  update(datas) {
    console.log("update datas:" + datas.dataMaps.size);
    this.state.videoMap = datas.dataMaps
    this.setState({ datas: datas.data });
  }

  //注册下载进度回掉监听
  registerReceiver() {
    console.log("registerReceiver:" + this.props.isDownloadedPage);
    if (this.props.isDownloadedPage) {
      return;
    }
    //开始回掉
    DeviceEventEmitter.addListener("startDownloadEvent", msg => {
      console.log("startDownload" + msg);
      // this.setState({ downloadingInfo: msg.downloadInfo });
    });

    //开始回掉
    DeviceEventEmitter.addListener("downloadFailedEvent", msg => {
      console.log("downloadFailedEvent" + JSON.stringify(msg));
    });

    //开始回掉
    DeviceEventEmitter.addListener("downloadSpeedEvent", msg => {
      console.log("downloadSpeedEvent" + JSON.stringify(msg));
      var speed = msg.downloadSpeed;
      var key = msg.vid + msg.bitrate;
      var downloadView = this.refsCollection[key];
      if (!downloadView) {
        console.log("downloadView is null");
        return;
      }

      downloadView.setState({ speed: speed });
    });
    //进度更新回掉
    DeviceEventEmitter.addListener("updateProgressEvent", msg => {
      var dataMaps = this.state.videoMap;
      if (!dataMaps || dataMaps.size == 0) {
        return;
      }

      //这里保存下载对象，onstart 不保存 因为可能从中间进入列表 如果保存过  对比一次 是否需要再次更新
      var downloadInfo = this.state.downloadingInfos.get(msg.downloadInfo);

      if (!downloadInfo) {
        //如果沒经保存
        downloadInfo = JSON.parse(msg.downloadInfo);
        if (!downloadInfo) {
          console.log("downloadInfo is null");
          return;
        }
        this.state.downloadingInfos.set(msg.downloadInfo, downloadInfo);
      }
      
      var key = downloadInfo.vid + downloadInfo.bitrate;
      var updateVideo = dataMaps.get(key);
      if (updateVideo) {
        updateVideo.percent = msg.current;
        updateVideo.total = msg.total;
        updateVideo.progress = msg.progress;
        this.refsCollection[key].setState({
          data: updateVideo,
          videoStatus: 0
        });
      }

    });

    //下载完成回掉
    DeviceEventEmitter.addListener("downloadSuccessEvent", msg => {
      console.log(`downloadSuccess:${msg.vid}  bitrate ：${msg.bitrate}`);
      var key = msg.vid + msg.bitrate;
      var downloadView = this.refsCollection[key];
      if (!downloadView) {
        console.log("downloadView is null");
        return;
      }
      var successDownload = downloadView.state.data;
      //将下载完成得数据回掉给父组件，更新到下载完成列表
      this.props.downloadCallback(successDownload);

      //更新
      // this.refsCollection[key].setState({ videoStatus: 3 });
      //筛选掉下载完成得数据并更新当前下载列表
      const result = this.state.datas.filter(item => {
        return item.vid + item.bitrate !== key;
      });

      var dataMaps = this.state.videoMap;
      dataMaps.delete(key);
      this.setState({ datas: result });
    });
  }

  //列表的item 容器
  refsCollection = {};

  //侧滑菜单渲染
  getQuickActions = () => {
    return (
      <View style={styles.quickAContent}>
        <TouchableHighlight onPress={() => alert("确认删除？")}>
          <View style={styles.quick}>
            <Text style={styles.delete}>删除</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  };

  _onPressItem(item) {
    var itemKey = item.vid + item.bitrate;
    Alert.alert(
      "删除该视频",
      "",
      [
        {
          text: "确定",
          onPress: () => {
            //筛选掉下载完成得数据并更新当前下载列表
            const result = this.state.datas.filter(item => {
              return item.vid + item.bitrate != itemKey;
            });
            var dataMaps = this.state.videoMap;
            dataMaps.delete(itemKey);
            this.setState({ datas: result });

            var delItem = item;
            var resultCode = PolyvVideoDownload.deleteDownload(delItem.vid, delItem.bitrate);
            //如果失败弹出提示语
            if (resultCode != PolyvVodDownloadResultCode.SUCCESS) {
              var errorDes = PolyvVodDownloadResultCode.getErrorDes(resultCode)
              alert(errorDes)
            }
          }
        },
        { text: "取消" }
      ],
      {
        cancelable: true,
        onDismiss: () => {
        }
      }
    );
  }

  renderItemData({ item, index }) {
    //标记key 用于item 标记
    var id = item.vid + item.bitrate;
    return (
      <PolyvVideoDownloadItem
        ref={instance => {
          this.refsCollection[id] = instance;
        }}
        {...this.props}
        style={styles.modalBox}
        isDownloadedPage={this.props.isDownloadedPage}
        downloadInfo={item}
        onPressItem={this._onPressItem.bind(this)}
      />
    );
  }

  //暂停或开始下载全部
  _startOrPauseDownloadAll() {
    if(this.state.datas.length == 0){
      return
    }
    if (this.state.allTaskDownloadPause) {
      PolyvVideoDownload.startAllDownload();
      this.updateAllDownloadStatus(0);
    } else {
      PolyvVideoDownload.pauseAllDownload();
      this.updateAllDownloadStatus(1);
    }

    this.setState({ allTaskDownloadPause: !this.state.allTaskDownloadPause });
  }

  updateAllDownloadStatus(status) {
    this.state.downloadingInfos.forEach(value => {
      var key = value.vid + value.bitrate;
      var downloadView = this.refsCollection[key];
      if (downloadView) {
        console.log("updateAllDownloadStatus:" + status);
        downloadView.setState({ videoStatus: status });
      } else {
        console.log("download view is undefine");
      }
    });
  }

  // 清除所有正在下载的视频
  _clearAll() {
    if(this.state.datas.length == 0){
      return
    }
    Alert.alert('提示','是否要清空所有下载中的任务',[
      {
        text: "确定",
        onPress: () => {
          PolyvVideoDownload.deleteAllDownload();
          this.setState({
            datas: [],
            downloadingInfos: new Map(), 
            videoMap: new Map(),
            allTaskDownloadPause: false 
          });
        }
      },
      { text: "取消" }
    ],
    {
      cancelable: true,
      onDismiss: () => {
      }
    })
    
  }

  createFooterView() {
    return this.props.isDownloadedPage ? null : (
      <Footer>
        <FooterTab>
          <Button onPress={this._startOrPauseDownloadAll.bind(this)}>
            <Text style={styles.footerTxt}>
              {this.state.allTaskDownloadPause ? "下载全部" : "暂停全部"}
            </Text>
          </Button>
          <Button
            onPress={() => {
              this._clearAll();
            }}
          >
            <Text style={styles.footerTxt}>全部清空</Text>
          </Button>
        </FooterTab>
      </Footer>
    );
  }

  emptyView = () => {
      return (
        <View style={styles.empty_container}>
          <Text style={styles.empty}>暂无下载视频</Text>
          </View> 
      );
  };

  render() {
    console.log(" list status " + this.props.isDownloadedPage);
    var bottomView = this.createFooterView();
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.list}
          data={this.state.datas}
          renderItem={this.renderItemData.bind(this)}
          keyExtractor={(item, index) => {
            return item.vid+item.bitrate+index}
          }
          ListEmptyComponent={this.emptyView}
        />
        {bottomView}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white',
    alignItems: "center",
    justifyContent: "center"
  },
  empty_container: {
    height:height,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  empty: {
    textAlign:'center',
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  footerTxt: {
    fontSize: 15
  },
  modalBox: {
    width: width,
    height: 50
  },
  list: {
    width: width
  },
  delete: {
    color: "#d8fffa",
    marginRight: 30
  },
  //侧滑菜单的样式
  quickAContent: {
    margin: 10,
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  quick: {
    backgroundColor: "red",
    alignItems: "flex-end", //水平靠右
    justifyContent: "center", //上下居中
    width: 80,
    height: 70
  },
  delete: {
    color: "#d8fffa",
    marginRight: 30
  }
});
