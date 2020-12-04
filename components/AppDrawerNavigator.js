import React from 'react';
import {View, Text} from 'react-native';
import {DrawerItems} from 'react-navigation-drawer';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {AppTabNavigator} from './AppTabNavigator';
import CustomSideBarMenu from './CustomSideBarMenu'
import SettingsScreen from '../screens/SettingsScreen';
import MyDonationsScreen from '../screens/MyDonationsScreen';
import NotificationScreen from '../screens/NotificationScreen';

export const AppDrawerNavigator = createDrawerNavigator({
    Home : {
        screen : AppTabNavigator
    },
    MyDonations : {
        screen : MyDonationsScreen
    },
    Settings : {
        screen : SettingsScreen
    },
    Notifications : {
        screen : NotificationScreen
    }
},
    {
        contentComponent : CustomSideBarMenu
    },
    {
        initialRouteName : 'Home'
    }
)




