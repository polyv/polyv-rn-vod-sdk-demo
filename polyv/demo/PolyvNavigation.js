import React, { Component } from "react";
import { Title, Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
import PolyvOnlineVideoListPage from './onlineList/PolyvOnlineVideoListPage';
import PolyvVodPlayerPage from './player/PolyvVodPlayerPage';
import PolyvDownloadListPage from './downloadList/PolyvDownloadListPage';


const Stack = createStackNavigator();
function MyStack() {
  return (
    <Stack.Navigator initialRouteName="OnlineList">
      <Stack.Screen name="OnlineList" component={PolyvOnlineVideoListPage} 
      options={({ navigation, route }) => ({
          headerRight: () => (
            <Button
            onPress={() =>  {
              console.log('nav btn is ')
              navigation.navigate('downloadList')
            }}
              title="下载列表"
              color="#333"
            />
          ),
        })}/>
      <Stack.Screen name="VideoPlayer" component={PolyvVodPlayerPage} />
      <Stack.Screen name="downloadList" component={PolyvDownloadListPage} />
    </Stack.Navigator>
  );
}


export default function PolyvNavigation() {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

// const AppNavigator = createStackNavigator(
//   {
//     OnlineList: PolyvOnlineVideoListPage,
//     VideoPlayer: PolyvVodPlayerPage ,
//     downloadList:PolyvDownloadListPage
//   },
//   {
//     initialRouteName: "OnlineList",
//   }
// );
// const PolyvNavigation = createAppContainer(AppNavigator);

// module.exports = PolyvNavigation;
