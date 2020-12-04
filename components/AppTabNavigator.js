import React from 'react';
import {Image} from 'react-native';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import DonateScreen from '../screens/DonateScreen';
import RequestScreen from '../screens/RequestScreen';

export const AppTabNavigator = createBottomTabNavigator({
    DonateBooks : {screen : DonateScreen,
    navigationOptions : {
        tabBarIcon : <Image
        style = {{
            width : 30,
            height : 30
        }}
        source = {require('../assets/request list.png')}
        />,
        tabBarLabel : 'DonateBooks'
    }
    },
    RequestBooks : {screen : RequestScreen,
        navigationOptions : {
            tabBarIcon : <Image
            style = {{
                width : 30,
                height : 30
            }}
            source = {require('../assets/request.png')}
            />,
            tabBarLabel : 'RequestBooks'
        }
    }
})