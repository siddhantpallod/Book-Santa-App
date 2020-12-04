import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import {AppTabNavigator} from './components/AppTabNavigator';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {AppDrawerNavigator} from './components/AppDrawerNavigator';
import {AppStackNavigator} from './components/AppStackNavigator';

export default class App extends React.Component {
 render(){
  return (
    <View style = {{flex : 1}} >
      <AppContainer/>
    </View>
  );
 }
}

const switchNavigator = createSwitchNavigator({
  LoginScreen : {screen : LoginScreen},
  Drawer : {screen : AppDrawerNavigator},
  Stack : {screen : AppStackNavigator},
  BottomTab : {screen : AppTabNavigator}
})

const AppContainer = createAppContainer(switchNavigator)
