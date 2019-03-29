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

const { width,height } = Dimensions.get("window");

type Props = {};
export default class PolyvVodPlayerPage extends Component<Props> {
  static navigationOptions = (
    { navigation }) => {
      return {
        headerTitle: '视频播放',
      }
  };

  constructor(props) {
    super(props);
    this.state = {
        vid:'',
      // 输入框默认vid
      inputVid: "e97dbe3e649c56a1e58535bd8c5d3924_e",
      canDownload: false
    };
  }

  componentWillUnmount(){
    this.refs["playerA"].release()
  }

  updateVid() {
    if(!this.state.inputVid){
      Alert.alert('vid is error')
      return
  }
    console.log("updateVid");
    this.refs["playerA"].updateVid(this.state.inputVid);
  }

  startOrPause() {
    console.log("startOrPause");
    this.refs["playerA"].startOrPause();
  }

  play() {
    console.log("play");
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
    console.log('app render')
    const { navigation } = this.props;
    const vid = navigation.getParam('vid', '');
    return (
        <View>
          <PolyvVodPlayer
            ref="playerA"
            style={styles.video}
            vid={vid}
            isAutoStart={true}
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
    width:width,
    height:height,
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
