import React from 'react';
import {Header} from 'react-native-elements';
import { StyleSheet, Text, View } from 'react-native';

const MyHeader = props => {
    return(
        <Header
            centerComponent = {{
                text : props.title,
                style : {color : 'red', fontSize : 25}
            }}
            backgroundColor = 'black'
        />
    )
}

export default MyHeader;
