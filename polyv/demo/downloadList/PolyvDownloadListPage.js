import React, { Component } from "react";
import { View, StyleSheet, Dimensions, Image,TouchableOpacity } from "react-native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PolyvdownloadModule from "../../sdk/PolyvVodDownloadModule";
import { PolyvVideoDownloadList } from "./view/PolyvVideoDownloadList";

const { width, height } = Dimensions.get("window");
let nav ={}
let img = require("../img/polyv_btn_back.png");

const PolyvViewManager={
  refCollection:{}
}

// 已下载列表
class PolyvDownloadedListPage extends Component {
  static navigationOptions = {
    tabBarLabel: "已下载"
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.getDownloadedVideos();
  }

  getDownloadedVideos() {
    console.log("DownloadListPage - Downloaded - getDownloadedVideos()");
    PolyvdownloadModule.getDownloadVideoList(true)
      .then(ret => {
        if (ret.code == 0) {
          console.log("downloaded success :" + ret.dataMaps);
          PolyvViewManager.refCollection['downloadedList'].update(ret);
        }
        else {
          console.log("downloaded error 1:" + ret.message);
        }
      })
      .catch(e => {
        console.log("downloaded error 2:" + e);
      });
  }

  render() {
    console.log('DownloadListPage - Downloaded - render')
    return (
      <PolyvVideoDownloadList
        nav={nav}//传递首页的导航栏实例
        {...this.props} 
        style={styles.container}  
        ref={(instance) =>{
          PolyvViewManager.refCollection['downloadedList'] = instance
        }} 
        isDownloadedPage={true} 
      />
      // <View />
    );
  }
}

//下载中列表
class PolyvDownloadingListPage extends Component {
  static navigationOptions = {
    tabBarLabel: "下载中"
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount(){
    setTimeout(() => {
      this.getDownloadingVideos()
    }, 50);
  }

  getDownloadingVideos() {
    console.log("DownloadListPage - Downloading - getDownloadingVideos()");
    PolyvdownloadModule.getDownloadVideoList(false)
      .then(ret => {
          if(ret.code == 0){
            console.log("downloading success :" + ret.dataMaps);
            console.info('ref', PolyvViewManager.refCollection['downloadingList'])
            PolyvViewManager.refCollection['downloadingList'].update(ret);
          }else{
            console.log("downloading error 1:" + ret.message);
          }
      })
      .catch(e => {
        console.log("downloading error 2:" + e);
      });
  }

  updateDownload(successDwonloadInfo){
    var newDatas = PolyvViewManager.refCollection['downloadedList'].state.datas;
    // newDatas.splice(newDatas.length,0,successDwonloadInfo)
    console.log('downloading success callback:'+JSON.stringify(successDwonloadInfo))
    PolyvViewManager.refCollection['downloadedList'].setState({datas:newDatas.concat(successDwonloadInfo)})
  }
  
  render() {
    console.log('DownloadListPage - Downloading - render')
    return (
      <PolyvVideoDownloadList
        nav={nav}//传递首页的导航栏实例
        {...this.props} 
        style={styles.container}  
        ref={(instance) =>{
          PolyvViewManager.refCollection['downloadingList'] = instance
        }} 
        downloadCallback={this.updateDownload}
        isDownloadedPage={false}
      />
      // <View />
    );
  }
}

export default class PolyvDownloadListPage extends Component {
  static navigationOptions = {
    tabBarVisible: false, // 隐藏底部导航栏
    header: null ,//隐藏顶部导航栏
  };
  constructor(props) {
    super(props);
    this.state = {
      datas: []
    };
  }

  render() {
    nav = this.props.navigation
    return (
      <View style={styles.container}>
        <AppContainer />
      </View>
    );
  }
}

const Tab = createMaterialTopTabNavigator();

function AppContainer() {
  return (
    <Tab.Navigator initialRouteName="downloaded">
      <Tab.Screen name="downloaded" component={PolyvDownloadedListPage} />
      <Tab.Screen name="downloading" component={PolyvDownloadingListPage} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    display: "flex",
    flexDirection: "row",
    width: width,
    flex: 1,
    backgroundColor: "gray"
  },
  tabBackContainer: {
    position: "absolute",
    margin: 10,
    width: 30,
    height: 30
  },
  tabBack: {
    width: 30,
    height: 30
  }
});
