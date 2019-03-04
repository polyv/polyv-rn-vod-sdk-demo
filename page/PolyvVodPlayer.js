'use strict';
import React, { Component } from "react"
import { requireNativeComponent, View, UIManager, findNodeHandle, Alert} from 'react-native';
import PropTypes from 'prop-types';


const PolyvVodPlayer = requireNativeComponent('PolyvVodPlayer', PolyvVodPlayerComponent, {
});

class PolyvVodPlayerComponent extends Component {
    static propTypes = {
        vid: PropTypes.string,
        isAutoStart:PropTypes.bool,
        ...View.propTypes // 包含默认的View的属性
    }

    updateVid(vid) {
        if(!vid){
            Alert.alert('vid is undefined')
            return
        }
        UIManager.dispatchViewManagerCommand(  
            findNodeHandle(this.refs.player),  
            UIManager.PolyvVodPlayer.Commands.updateVid, // Commands后面的值与原生层定义的`handleTask`一致  
            [vid] // 向原生层传递的参数数据,数据形如：["第一个参数","第二个参数",...]  
        );
    }

    startOrPause() {
        UIManager.dispatchViewManagerCommand(  
            findNodeHandle(this.refs.player),  
            UIManager.PolyvVodPlayer.Commands.startOrPause, // Commands后面的值与原生层定义的`handleTask`一致  
            [] // 向原生层传递的参数数据,数据形如：["第一个参数","第二个参数",...]  
        ); 
    }

    render() {
        return (
            <PolyvVodPlayer
                ref="player"
                style={{...this.props.style}}
                play_parameters={{vid:this.props.vid, is_auto_start:this.props.isAutoStart}}
            />
        )
    }
}

module.exports = PolyvVodPlayerComponent;
