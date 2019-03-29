'use strict';
import React, { Component } from "react"
import { requireNativeComponent, View, UIManager, findNodeHandle} from 'react-native';
import PropTypes from 'prop-types';


const PolyvVodPlayer = requireNativeComponent('PolyvVodPlayer', PolyvVodPlayerComponent, {
});

class PolyvVodPlayerComponent extends Component {
    static propTypes = {
        vid: PropTypes.string,
        isAutoStart:PropTypes.bool,
        onStart:PropTypes.func,
        ...View.propTypes // 包含默认的View的属性
    }

    updateVid(vid) {
        UIManager.dispatchViewManagerCommand(  
            findNodeHandle(this.refs.player),  
            UIManager.PolyvVodPlayer.Commands.updateVid, // Commands后面的值与原生层定义的`handleTask`一致  
            [vid] // 向原生层传递的参数数据,数据形如：["第一个参数","第二个参数",...]  
        );
    }

    play(){
        UIManager.dispatchViewManagerCommand(  
            findNodeHandle(this.refs.player),  
            UIManager.PolyvVodPlayer.Commands.play, // Commands后面的值与原生层定义的`handleTask`一致  
            [] // 向原生层传递的参数数据,数据形如：["第一个参数","第二个参数",...]  
        ); 
    }

    pause(){
        UIManager.dispatchViewManagerCommand(  
            findNodeHandle(this.refs.player),  
            UIManager.PolyvVodPlayer.Commands.pause, // Commands后面的值与原生层定义的`handleTask`一致  
            [] // 向原生层传递的参数数据,数据形如：["第一个参数","第二个参数",...]  
        ); 
    }

    release(){
        UIManager.dispatchViewManagerCommand(  
            findNodeHandle(this.refs.player),  
            UIManager.PolyvVodPlayer.Commands.release, // Commands后面的值与原生层定义的`handleTask`一致  
            [] // 向原生层传递的参数数据,数据形如：["第一个参数","第二个参数",...]  
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
