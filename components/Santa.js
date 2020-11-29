import React from 'react';
import LottieView from 'lottie-react-native';

export default class SantaAnimation extends React.Component{
    render(){
        return(
            <LottieView
                source = {require('../assets/10342-santa-claus-christmas.json')}
                autoPlay loop
            />
        )
    }
}