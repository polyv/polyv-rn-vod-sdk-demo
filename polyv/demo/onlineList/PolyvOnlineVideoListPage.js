/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from "react";
import {
  Text,
  View,
  TextInput,
  Dimensions,
  StyleSheet,
} from "react-native";
import { setAxios } from "../common/PolyvNet";

import PolyvVideoListView from "./view/PolyvVideoOnlineList";
import PolyvVodConfig from "../../sdk/PolyvVodConfigModule";
import PolyvUserConfig from '../PolyvUserConfig'

const { width, height } = Dimensions.get("window");

type Props = {};
export default class PolyvOnlineVideoListPage extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      // 初始化所需的数据
      vodKey:PolyvUserConfig.User.vodKey,
      decodeKey: PolyvUserConfig.User.decodeKey,
      decodeIv: PolyvUserConfig.User.decodeIv,
      viewerId: PolyvUserConfig.User.viewerId,
      nickName: PolyvUserConfig.User.nickName,
      userid: PolyvUserConfig.User.userid,
      writetoken: PolyvUserConfig.User.writetoken,
      readtoken: PolyvUserConfig.User.readtoken,
      secretkey: PolyvUserConfig.User.secretkey,

      // 输入框默认vid
      inputVid: PolyvUserConfig.User.inputVid,
      canDownload: false
    };
  }

  componentDidMount() {
    console.log("componentDidMount");
    /**
     * <Polyv Live init/>
     */
    console.log("Polyv vod init");
    setAxios();

    PolyvVodConfig.setToken(
        this.state.userid,
        this.state.writetoken,
        this.state.readtoken,
        this.state.secretkey,
        this.state.viewerId,
        this.state.nickName
    ).then(ret =>{
        if(ret.code != 0){
            //初始化失败
            var str = "初始化失败  errCode=" + ret.code + "  errMsg=" + ret.message;
            console.log(str);
            alert(str);
        } else {
            // 初始化成功
            console.log("初始化成功");
        }
    });
  }

  updateVid() {
    console.log("updateVid");
    this.refs["playerA"].updateVid(this.state.inputVid);
  }

  startOrPause() {
    console.log("startOrPause");
    this.refs["playerA"].startOrPause();
  }

  render() {
    console.log('app render')
    return (
      <View style={styles.container}>
      <PolyvVideoListView  navigation={this.props.navigation} ref='videoList' style={styles.video} />
    </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    width:width,
    height:height,
    backgroundColor: "gray"
  },
  video: {
    position: "relative",
    height: (width * 9) / 16,
    width: width
  },
  input: {
    height: 50,
    backgroundColor: "#C0C0C0",
    fontSize: 20,
    margin: 10,
    padding: 10
  },
  horizon: {
    display: "flex",
    flexDirection: "row",
    width: width
  },
  text: {
    textAlign: "center",
    flex: 1,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 20,
    height: 80,
    backgroundColor: "#63B8FF",
    margin: 10,
    padding: 10
  }
});