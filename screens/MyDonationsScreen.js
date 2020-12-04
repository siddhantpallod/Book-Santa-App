import React from 'react';
import {View,Text,FlatList,TouchableOpacity} from 'react-native';
import firebase from 'firebase';
import db from '../config';
import {Icon,ListItem } from 'react-native-elements';
import MyHeader from '../components/MyHeader';

export default class MyDonationsScreen extends React.Component{
    
    constructor(){
        super();

        this.state = {
            email : firebase.auth().currentUser.email,
            allDonations : [],
            donorName : ''
        }
    }

    sendNotification = (bookDetails,requestStatus) => {
        var requestId = bookDetails.requestId
        var donorId = bookDetails.donorId
        db.collection('allNotifications').where('requestId', '==', requestId)
        .where('donorId', '==',donorId).get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                var message = ''
                if(requestStatus === 'Book Sent'){
                    message = this.state.donorName + ' ' + "sent you the book"
                }
                else{
                    message = this.state.donorName + ' ' + "has shown interest in donating the book"
                }
                db.collection('allNotifications').doc(doc.id).update({
                    'message' : message,
                    'status' : 'unread',
                    'date' : firebase.firestore.FieldValue.serverTimestamp()
                })
            })
        })
    }

    getDonorDetails = (donorId) => {
        db.collection('users').where('userEmail','==',donorId).get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                this.setState({
                    donorName : doc.data().firstName + ' ' + doc.data().lastName
                })
            })
        })
    }

    sendBook = (bookDetails) => {
        if(bookDetails.requestStatus === 'Send Book'){
            var donorStatus = 'Donar Interested'
            db.collection('allDonations').doc(bookDetails.doc_id).update({
                'requestStatus' : 'Donor Interested'
            })
            this.sendNotification(bookDetails,donorStatus)
        } else {
            var donorStatus = 'Book Sent'
            db.collection('allDonations').doc(bookDetails.doc_id).update({
                'requestStatus' : 'Book Sent'
            })
            this.sendNotification(bookDetails,donorStatus)
        }
    }

    getAllDonations = () => {
        this.requestRef = db.collection('allDonations').where('donorId', '==', this.state.email)
        .onSnapshot(snapshot => {
            var donations = snapshot.docs.map(document => document.data())
            this.setState({
                allDonations : donations
            })
        })
    }
    
    keyExtractor = (item,index) => index.toString()
    renderItem = ({item , I}) => (
        <ListItem
            key = {I}
            title = {item.bookName}
            subtitle = {'Requested By:' + item.requestedBy + '\n Status: ' + item.requestStatus}
            leftElement = {
                <Icon
                name = 'Books'
                type = 'font-awesome'
                color = 'white'
            />}
            rightElement = {
            <TouchableOpacity 
            onPress = {()=> {
                this.sendBook(item)
            }}
            >
                <Text> {item.requestStatus === 'Book Sent' ? 'Book Sent' : 'Send Book'} </Text>
            </TouchableOpacity>}

            bottomDivider
            />
    )

    componentDidMount(){
        this.getAllDonations()
        this.getDonorDetails(this.state.email)
    }

    componentWillUnmount(){
        this.requestRef
    }

    

    render(){
        return(
            <View style = {{flex : 1}}>
                <MyHeader
                navigation = {this.props.navigation}
                title = 'My Donations'
                />
                <View>
                    {this.state.allDonations.length === 0
                    ? (<Text> List Of All Book Donations </Text>) 
                    : (<FlatList
                        keyExtractor = {this.keyExtractor}
                        data = {this.state.allDonations}
                        renderItem = {this.renderItem}
                        />)}
                    
                </View>
            </View>
        )
    }
}