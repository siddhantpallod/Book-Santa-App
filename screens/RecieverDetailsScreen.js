import React from 'react';
import {View,Text,TouchableOpacity} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import {Card,Header,Icon} from 'react-native-elements';


export default class RecieverDetailsScreen extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            email : firebase.auth().currentUser.email,
            recieverId : this.props.navigation.getParam('details')['userEmail'],
            requestId : this.props.navigation.getParam('details')['requestId'],
            bookName : this.props.navigation.getParam('details')['bookName'],
            reason : this.props.navigation.getParam('details')['reason'],
            recieverName : '',
            recieverNo : '',
            recieverAddress : '',
            recieverRequestDocID : '',
            userName : ''
        }
    }

    getRecieverDetails(){
        db.collection('users').where('userEmail', '==', this.state.recieverId ).get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                this.setState({
                    recieverName : doc.data().firstName,
                    recieverNo : doc.data().contactNo,
                    recieverAddress : doc.data().userAddress
                })
            })
        })
        db.collection('requestedBooks').where('requestId', '==', this.state.requestId).get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                this.setState({
                    recieverRequestDocID : doc.id
                })
            })
        })
    }

    componentDidMount(){
        this.getRecieverDetails()
        this.getUserDetails(this.state.email)
    }

    updateBookStatus = () => {
        db.collection('allDonations').add({
           bookName : this.state.bookName,
           requestId : this.state.requestId,
           requestedBy : this.state.recieverName,
           donorId : this.state.email,
           requestStatus : 'Donor Interested'
        })
    }

    addNotifications = () => {
        var message = this.state.userName + ' ' +  'has shown interest in donating the book'
        db.collection('allNotifications').add({
            recieverUserID : this.state.recieverId,
            donorId : this.state.email,
            requestId : this.state.requestId,
            bookName : this.state.bookName,
            date : firebase.firestore.FieldValue.serverTimestamp(),
            status : 'unread',
            message : message
        })
    }

    getUserDetails = (userId) => {
        db.collection('users').where('userEmail','==',userId).get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                this.setState({
                    userName : doc.data().firstName + ' ' + doc.data().lastName
                })
            })
        })
    }

    render(){
        return(
            <View>
                <View style = {{flex : 0.1}}>
                   <Header
                   leftComponent = {<Icon
                    name = 'arrow-left'
                    type = 'feather'
                    color = 'white'
                    onPress = {() => {
                        this.props.navigation.goBack()
                    }}
                   />}

                   centerComponent = {{
                    text : 'Donate Books',
                    style : {color : 'red',fontSize : 20}
                   }}
                   backgroundColor = 'black'
                   />
                </View>
                <View style = {{flex : 0.3}}>
                   <Card 
                   title = {'Book Details'}
                   >  
                   <Card>
                     <Text> BOOK NAME : {this.state.bookName} </Text>  
                   </Card>
                   <Card>
                       <Text> REASON : {this.state.reason} </Text>
                   </Card>
                   </Card>
                </View>
                <View style = {{flex : 0.3}}>
                   <Card
                   title = {'Reciever Details'}
                   >
                    <Card>
                        <Text> NAME : {this.state.recieverName} </Text>
                    </Card>
                    <Card>
                        <Text> CONTACT NO : {this.state.recieverNo} </Text>
                    </Card>
                    <Card>
                        <Text> ADDRESS : {this.state.recieverAddress} </Text>
                    </Card>
                   </Card>
                </View>
                <View>
               { this.state.recieverId != this.state.email
               ? (
                  <TouchableOpacity 
                  style = {{
                    backgroundColor : 'black',
                    width : 100,
                    height : 50,
                    borderWidth : 2,
                    borderRadius : 11,
                    alignSelf : 'center',
                    borderColor : 'blue',
                    marginTop : 30
                  }}
                  onPress = {()=> {
                      this.updateBookStatus()
                      this.addNotifications()
                      this.props.navigation.navigate('MyDonations')
                  }}> 
                    <Text style = {{color : 'white', fontSize : 20,textAlign : 'center'}}> Donate </Text>    
                  </TouchableOpacity> 
               )
            : null
            } 
                </View>
            </View>
        )
    }
}