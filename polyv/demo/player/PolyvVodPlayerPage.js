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

import PolyvVodPlayer from '../../sdk/PolyvVodPlayerModule'

const { width, height } = Dimensions.get("window");

type Props = {};
export default class PolyvVodPlayerPage extends Component<Props> {
  // static navigationOptions = (
  //   { navigation }) => {
  //   return {
  //     headerTitle: '视频播放',
  //   }
  // };

  constructor(props) {
    super(props);
    this.state = {
      vid: '',
      // 输入框默认vid
      inputVid: "3b9dfca1bedb0d209a08be8f1881a9ad_3",
      canDownload: false
    };
  }

  componentWillUnmount() {
    this.refs["playerA"].release()
  }

  componentDidMount() {
    // this.refs["playerA"].setFullScreen(true)
  }

  updateVid() {
    if (!this.state.inputVid) {
      Alert.alert('vid is error')
      return
    }
    console.log("updateVid inputVid：" + this.state.inputVid);
    this.refs["playerA"].updateVid(this.state.inputVid);
  }

  startOrPause() {
    console.log("startOrPause");
    this.refs["playerA"].startOrPause();
  }

  play() {
    console.log("play vid:" + this.state.vid);
    this.refs["playerA"].play();
  }

  pause() {
    console.log("pause");
    this.refs["playerA"].pause();
  }

  showDownloadOptions() {
    console.log("showDownloadOptions");
    this.popUp.show()
  }


  render() {
    console.log('PlayerPage - app render')
    const { route, navigation } = this.props;
    const { vid } = route.params;  
    console.log('PlayerPage - vid:' + vid)
    return (
      <View>
        <PolyvVodPlayer
          ref="playerA"
          style={styles.video}
          vid={vid}
          isAutoStart={true}
          fullScreen={false}
          marquee={{
            displayDuration:8,//单位：秒  单次跑马灯显示时长
            maxRollInterval:1,//单位：秒  两次滚动的最大间隔时长，实际的间隔时长是取 0~maxRollInterval 的随机值[即显示时间]
            content:'我是跑马灯',//跑马灯内容
            color:'#0000FF',//跑马灯颜色
            alpha:0.5,//跑马灯透明度
            font:20,//跑马灯字体
            reappearTime:2,//单位：秒 设置跑马灯再次出现的间隔
          }}
        />
        <TextInput
          style={styles.input}
          placeholder={"请输入更新vid"}
          onChangeText={text => {
            this.setState({ vid: text });
          }}
        >
          {this.state.inputVid}
        </TextInput>
        <View style={styles.horizon}>
          <Text style={styles.text} onPress={this.updateVid.bind(this)}>
            updateVid
            </Text>
          <Text style={styles.text} onPress={this.play.bind(this)}>
            play
            </Text>
          <Text style={styles.text} onPress={this.pause.bind(this)}>
            pause
            </Text>
          {/* <Text
              style={styles.text} onPress={this.showDownloadOptions.bind(this)}>
              download
            </Text> */}
          {/* <ProgressBarAndroid /> */}
        </View>


        {/* <PolyvVodPlayer
            ref='playerB'
            style={styles.video}
            vid={"e97dbe3e64c247499b55f213a4470052_e"}
            isAutoStart={true}
          /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: "#ffffff"
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
    fontSize: 16,
    height: 50,
    backgroundColor: "#63B8FF",
    margin: 10,
    padding: 10
  }
});
