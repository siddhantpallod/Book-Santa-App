import React from 'react';
import {Header,Icon,Badge} from 'react-native-elements';
import { StyleSheet, Text, View } from 'react-native';
import { createDrawerNavigator } from 'react-navigation';

const BellIconWithBadge = (props) => {
    return(
        <View>
            <Icon
                name = 'bell'
                type = 'font-awesome'
                color = 'white'
                size = {25}
                onPress = {() => 
                    props.navigation.navigate('Notifications')
                }
            />

            <Badge
                value = '1'
                containerStyle = {{position : 'absolute',top : -4,right : -4}}
            />
        </View>
    )
}
const MyHeader = props => {
    return(
        <Header
            leftComponent = {
                <Icon
                name = 'bars'
                type = 'font-awesome'
                color = 'white'
                onPress = {() => 
                    props.navigation.toggleDrawer()
                }
                />       
            }
            centerComponent = {{
                text : props.title,
                style : {color : 'red', fontSize : 25}
            }}

            rightComponent = {
                <BellIconWithBadge
                {...props}
                />
            }
            
            backgroundColor = 'black'
        />
    )
}

export default MyHeader;
