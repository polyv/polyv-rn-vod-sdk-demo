import React, { Component } from "react";
import { createStackNavigator, createAppContainer } from "react-navigation";
import PolyvOnlineVideoListPage from './onlineList/PolyvOnlineVideoListPage';
import PolyvVodPlayerPage from './player/PolyvVodPlayerPage';
import PolyvDwonloadListPage from './downloadList/PolyvDwonloadListPage';

const AppNavigator = createStackNavigator(
  {
    OnlineList: PolyvOnlineVideoListPage,
    VideoPlayer: PolyvVodPlayerPage ,
    downloadList:PolyvDwonloadListPage
  },
  {
    initialRouteName: "OnlineList",
  }
);
const PolyvNavigation = createAppContainer(AppNavigator);



module.exports = PolyvNavigation;
