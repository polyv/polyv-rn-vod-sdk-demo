/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from 'react';
import { Text, View, TextInput, Dimensions, StyleSheet } from 'react-native';
import PolyvVodConfigRnModule from './page/PolyvVodConfigRnModule'
import PolyvVodPlayer from './page/PolyvVodPlayer';

const { width } = Dimensions.get('window');

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      // 初始化所需的数据
      vodKey: "yQRmgnzPyCUYDx6weXRATIN8gkp7BYGAl3ATjE/jHZunrULx8CoKa1WGMjfHftVChhIQlCA9bFeDDX+ThiuBHLjsNRjotqxhiz97ZjYaCQH/MhUrbEURv58317PwPuGEf3rbLVPOa4c9jliBcO+22A==",
      decodeKey: "VXtlHmwfS2oYm0CZ",
      decodeIv: "2u9gDPKdX6GyQJKU",
      viewerId: "rn_viewerId",
      nickName: "rn_nickName",

      // 输入框默认vid
      inputVid: 'e97dbe3e649c56a1e58535bd8c5d3924_e',
    };
  }

  componentWillMount() {
    console.log("componentWillMount")
    /**
     * <Polyv Live init/>
     */
    console.log("Polyv vod init")
    PolyvVodConfigRnModule.init(this.state.vodKey, this.state.decodeKey, this.state.decodeIv, this.state.viewerId, this.state.nickName)
      .then(ret => {
        if (ret.code != 0) { // 初始化失败
          var str = "初始化失败  errCode=" + ret.code + "  errMsg=" + ret.message
          console.log(str)
          alert(str)
        } else { // 初始化成功
          console.log("初始化成功")
        }
      })
  }

  updateVid() {
    console.log("updateVid")
    this.refs['playerA'].updateVid(this.state.inputVid);
  }

  startOrPause() {
    console.log("startOrPause")
    this.refs['playerA'].startOrPause()
  }

  render() {
    return (
      <View>
        <PolyvVodPlayer
          ref='playerA'
          style={styles.video}
          vid={"e97dbe3e64cb3adef1a27a42fe49228e_e"}
          isAutoStart={true}
        />
        <TextInput style={styles.input} placeholder={'请输入更新vid'} onChangeText={(text) => {
          this.setState({ vid: text })
        }}>{this.state.inputVid}</TextInput>
        <View style={styles.horizon}>
          <Text style={styles.text} onPress={this.updateVid.bind(this)}>updateVid</Text>
          <Text style={styles.text} onPress={this.startOrPause.bind(this)}>start or pause</Text>
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
    backgroundColor: '#ffffff',
  },
  video: {
    position: 'relative',
    height: width * 9 / 16,
    width: width,
  },
  input: {
    height: 50,
    backgroundColor: '#C0C0C0',
    fontSize: 20,
    margin: 10,
    padding: 10,
  },
  horizon: {
    display: 'flex',
    flexDirection: 'row',
    width: width,
  },
  text: {
    textAlign: 'center',
    flex: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    height: 50,
    backgroundColor: "#63B8FF",
    margin: 10,
    padding: 10,
  },
});
