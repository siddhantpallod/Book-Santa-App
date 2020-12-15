import React from 'react';
import {View,Text,FlatList} from 'react-native';
import firebase from 'firebase';
import db from '../config';
import {ListItem,Icon} from 'react-native-elements';
import MyHeader from '../components/MyHeader';

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
        alert("Email " + this.state.email)
        this.notificationRef = db.collection('allNotifications')
        .where('status', '==', 'unread').where('recieverUserID', '==' , "siddhantpallod@gmail.com")
        .onSnapshot((snapshot) => {
            var notifications = []
            snapshot.docs.map((doc) => {
                var details = doc.data()
                alert("Data " + details)
                details['doc_id'] = doc.id
                alert("details :" + doc.bookName)
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
                    <FlatList
                        keyExtractor = {this.keyExtracter}
                        renderItem = {this.renderItem}
                        data = {this.state.allNotifications}
                    />)
                }
                </View>
            </View>
        )
    }
}