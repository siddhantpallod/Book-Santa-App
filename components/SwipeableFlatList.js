import React from 'react';
import {View,Text,Dimensions} from 'react-native';
import { ListItem,Icon } from 'react-native-elements';
import {SwipeListView} from 'react-native-swipe-list-view';
import db from '../config';

export default class SwipeableFlatList extends React.Component{
    
    constructor(props){
        super(props);

        this.state = {
            allNotifications : this.props.allNotifications
        }
    }
    
    onSwipeValueChanged = swipeData => {
        var allNotifications = this.state.allNotifications
        const {key, value} = swipeData
        
        if(value < -Dimensions.get('window').width){
            const newData = [...allNotifications]
            const newIndex = allNotifications.findIndex(item => item.key == key)
            this.updateStatusAsRead(allNotifications[newIndex])
            newData.splice(newIndex, 1)
            this.setState({
                allNotifications : newData
            })
        }
    }

    updateStatusAsRead = (notification) => {
        db.collection("allNotifications").doc(notification.doc_id).update({
            status : "read"
        })
    }

    renderItem = data => (
    
        <ListItem
            leftElement = {
                <Icon
                    name = "book"
                    type = "font-awesome"
                />
            }
            title = {data.item.bookName}
            subtitle = {data.item.message}
       
            bottomDivider/>
    )
    

    renderHiddenItem = () => (
        <View style = {{backgroundColor : "cyan", flex : 1, flexDirection : "row"}}>
            <View style = {{position : "absolute"}}>
                <Text style = {{color : "yellow"}}>  </Text>
            </View>
        </View>
    )
    
    render(){
        return(
            <View>
                <SwipeListView
                    disableRightSwipe
                    data = {this.state.allNotifications}
                    renderItem = {this.renderItem}
                    renderHiddenItem = {this.renderHiddenItem}
                    rightOpenValue = {-Dimensions.get("window").width}
                    previewRowKey = {'0'}
                    previewOpenValue = {-40}
                    previewOpenDelay = {3000}
                    onSwipeValueChange = {this.onSwipeValueChanged}
                />
            </View>
        )
    }
}