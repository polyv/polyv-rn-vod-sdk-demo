import React, { Component } from "react";
import { View, StyleSheet, Dimensions, Image,TouchableOpacity } from "react-native";
import {
  createMaterialTopTabNavigator,
  createAppContainer
} from "react-navigation";
import PolyvdownloadModule from "../../sdk/PolyvVodDownloadModule";
import { PolyvVideoDownloadList } from "./view/PolyvVideoDownloadList";

const { width, height } = Dimensions.get("window");
let nav ={}
let img = require("../img/polyv_btn_back.png");

const PolyvViewManager={
  refCollection:{}
}

//已下载列表
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
    PolyvdownloadModule.getDownloadVideoList(true)
      .then(ret => {
        if (ret.code == 0) {
          console.log("downloed :" + ret.dataMaps);
          PolyvViewManager.refCollection['downloadedList'].update(ret);
        }
        else {
          console.log("download error:" + ret.message);
        }
      })
      .catch(e => {
        console.log("download error:" + e);
      });
  }

  render() {
    console.log('render downloaed')
    return (
      <PolyvVideoDownloadList  
      nav={nav}//传递首页的导航栏实例
      {...this.props} 
      style={styles.container}  
      ref={(instance) =>{
        PolyvViewManager.refCollection['downloadedList'] = instance
      }} 
      isDownloadedPage={true} />
    );
  }
}

//下载中列表
class PolyvDownloadingListPage extends Component {

  static navigationOptions = {
    tabBarLabel: "下载中"
  };

  componentDidMount(){
    setTimeout(() => {
      this.getDownloadingList()
    }, 50);
  }

  getDownloadingList() {
    PolyvdownloadModule.getDownloadVideoList(false)
      .then(ret => {
          if(ret.code == 0){
              this.refs.downloadingList.update(ret);
          }else{
            console.log("download error:" + ret.message);
          }
      })
      .catch(e => {
        console.log("download error:" + e);
      });
  }

  updateDownload(successDwonloadInfo){
    var newDatas = PolyvViewManager.refCollection['downloadedList'].state.datas;
    // newDatas.splice(newDatas.length,0,successDwonloadInfo)
    console.log('download success callback:'+JSON.stringify(successDwonloadInfo))
    PolyvViewManager.refCollection['downloadedList'].setState({datas:newDatas.concat(successDwonloadInfo)})
  }
  
  render() {
    return (
      <PolyvVideoDownloadList
        downloadCallback = {this.updateDownload}
        {...this.props}
        style={styles.container}
        ref={"downloadingList"}
        isDownloadedPage={false}
      />
    );
  }
}

export default class PolyvDwonloadListPage extends Component {
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

        <TouchableOpacity style={styles.tabBackContainer}
          onPress={() => {
            this.props.navigation.goBack();
          }}
        >
          <Image style={styles.tabBack} source={img} />
        </TouchableOpacity>
      </View>
    );
  }
}

const AppContainer = createAppContainer(
  createMaterialTopTabNavigator(
    {
      downloaded: { screen: PolyvDownloadedListPage },
      downloading: { screen: PolyvDownloadingListPage },
    },
    {
      initialRouteName: "downloaded",
      tabBarOptions: {
        activeTintColor: "tomato",
        inactiveTintColor: "gray",
        indicatorStyle: {
          width: 50,
          borderRadius: 5,
          marginLeft: width / (2 * 2) - 25,
          position: "absolute",
          backgroundColor: "#2196F3"
        },
        labelStyle: {},
        tabStyle: {},
        style: {
          backgroundColor: "white"
        }
      }
    }
  )
);

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
