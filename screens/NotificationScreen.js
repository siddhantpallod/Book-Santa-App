import React from 'react';
import {View,Text,FlatList,} from 'react-native';
import firebase from 'firebase';
import db from '../config';
import {ListItem,Icon} from 'react-native-elements';
import MyHeader from '../components/MyHeader';
import SwipeableFlatList from '../components/SwipeableFlatList';

export default class NotificationScreen extends React.Component{

    constructor(props){
        super(props);
        
        this.state = {
            email : firebase.auth().currentUser.email,
            allNotifications : []
        }
        this.notificationRef = null
    }

    getNotification = () => {
        this.notificationRef = db.collection('allNotifications')
        .where('status', '==', 'unread').where('recieverUserID', '==' , this.state.email)
        .onSnapshot((snapshot) => {
            var notifications = []
            snapshot.docs.map((doc) => {
                var details = doc.data()
                details['doc_id'] = doc.id
                notifications.push(details)
            })
            this.setState({
                allNotifications : notifications
            })
        
        })
    }

    componentDidMount(){
        this.getNotification()
    }

    componentWillUnmount(){
        this.notificationRef()
    }

    keyExtracter = (item,index) => index.toString()
    
    renderItem = ({item,I}) => {
        return(
        <ListItem
            key = {I}
            leftElement = {
                <Icon
                    name = 'Book'
                    type = 'font-awesome'
                />
            }
            
            title = {item.bookName}
            subtitle = {item.message}

            bottomDivider
        />
        )   
    }

    render(){
        return(
            <View style = {{flex : 1}}>
                <View style = {{flex : 0.1}}>
                    <MyHeader
                        title = {'Notifications'}
                        navigation = {this.props.navigation}
                    />
                </View>
                <View style = {{flex : 0.9}}>
                    {this.state.allNotifications.length === 0 
                    ? (<View style = {{flex : 0.9,alignItems : 'center',justifyContent : 'center'}}> 
                    <Text style = {{alignItems : 'center', fontSize : 25}}> You Have No Notifications </Text> 
                    </View>)
                    : (
                    <SwipeableFlatList
                        allNotifications = {this.state.allNotifications}
                    />
                    )
                }
                </View>
            </View>
        )
    }
}