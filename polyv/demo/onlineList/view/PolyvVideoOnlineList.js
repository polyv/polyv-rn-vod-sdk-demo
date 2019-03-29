import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  Text,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import PropTypes from "prop-types";
import OptionsView from "./PolyvBitratePopuWindow";
import { PolyvVideoOnlineItem } from "./PolyvVideoOnlineItem";
import PolyvHttpManager from '../../common/PolyvHttpManager'

const { width, height } = Dimensions.get("window");
let navigation, that; //导航栏引用
let pageNo = 1; //当前第几页
let totalPage = 5; //总的页数

export default class PolyvVideoOnlineList extends Component {
  static propTypes = {
    navigation: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      datas: [],
      showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
      refreshing:false
    };
    that = this;
  }

  componentDidMount(){
    setTimeout(() => {
      this.getOnlineList()
    }, 50);
  }

  update(datas) {
    console.log(" update list view");
    this.setState({ datas: datas });
  }

  
  getOnlineList() {
    console.log("showDownloadOptions");
    PolyvHttpManager.getVideoList(1,20,(success,error) =>{
      if(success){
        this.update(success.data)
      }
      this.setState({refreshing: false});
    })
  }

  renderItem({ item }) {
    return (
      <PolyvVideoOnlineItem
        downloadCallback={bitrates => {
          console.log("receive callback");
          that.showDownloadOptions(bitrates, item);
        }}
        navigation={navigation}
        style={styles.modalBox}
        videoInfo={item}
      />
    );
  }

  showDownloadOptions(bitrates, item) {
    console.log("showDownloadOptions");
    // var videoObject = JSON.parse(video);
    this.popUp.show(bitrates, item);
  }

  _separator() {
    return <View style={{ height: 15, backgroundColor: "#FFFAFA" }} />;
  }

  _onRefresh= () =>{
    this.setState({refreshing: true});
    this.getOnlineList()
  }

  render() {
    navigation = this.props.navigation;
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.list}
          ItemSeparatorComponent={this._separator}
          data={this.state.datas}
          renderItem={this.renderItem}
          onEndReached={this._onEndReached.bind(this)}
          ListFooterComponent={this._renderFooter.bind(this)}
          keyExtractor={(item, index) => {
            return item.vid + item.bitrate;
          }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        />
        <OptionsView ref={ref => (this.popUp = ref)} />
      </View>
    );
  }

  _onEndReached() {
    //如果是正在加载中或没有更多数据了，则返回
    if (this.state.showFoot != 0) {
      return;
    }
    //如果当前页大于或等于总页数，那就是到最后一页了，返回
    if (pageNo != 1 && pageNo >= totalPage) {
      return;
    } else {
      pageNo++;
    }
    //底部显示正在加载更多数据
    this.setState({ showFoot: 2 });
    //获取数据
    // this.fetchData( pageNo );
  }

  _renderFooter() {
    console.log("_renderFooter:" + this.state.showFoot);
    if (this.state.showFoot === 1) {
      return (
        <View
          style={{
            height: 80,
            alignItems: "center",
            justifyContent: "flex-start"
          }}
        >
          <Text
            style={{
              color: "#999999",
              fontSize: 14,
              marginTop: 5,
              marginBottom: 5
            }}
          >
            没有更多数据了
          </Text>
        </View>
      );
    } else if (this.state.showFoot === 2) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator />
          <Text>正在加载更多数据...</Text>
        </View>
      );
    } else if (this.state.showFoot === 0) {
      return (
        <View style={styles.footer}>
          <Text />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: "white",
    position: "absolute",
    top: 0,
    zIndex: 9
  },
  title: {
    margin: 15,
    textAlign: "center",
    display: "flex",
    color: "red",
    fontSize: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  modalBox: {
    backgroundColor: "white",
    width: width,
    height: 50
  },
  footer: {
    flexDirection: "row",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10
  },
  list: {
    width: width
  }
});
