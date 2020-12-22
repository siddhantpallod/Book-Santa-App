import React from 'react';
import { StyleSheet, Text, View,TextInput,TouchableOpacity,KeyboardAvoidingView,ImageBackground,TouchableHighlight} from 'react-native';
import MyHeader from '../components/MyHeader';
import db from '../config';
import firebase from 'firebase';
import {GoogleBookSearch} from 'react-native-google-books';
import { FlatList } from 'react-native';

export default class RequestScreen extends React.Component{

    constructor(){
        super();

        this.state = {
            userEmail : firebase.auth().currentUser.email,
            bookName : '',
            reason : '',
            isBookRequestActive : '',
            requestId : '',
            bookStatus : '',
            userDocId : '',
            docId : '',
            dataSource : '',
            showFlatList : false
        }
    }

    
    createUniqueId(){
        return Math.random().toString(36).substring(7)
    }

    getBookRequest = async () => {
        var bookRequest = db.collection('requestedBooks').where('userEmail', '==', this.state.userEmail)
        .get().then(snapshot => {
            snapshot.forEach(doc => {
                if(doc.data().bookStatus !== 'recieved'){
                    this.setState({
                        requestId : doc.data().requestId,
                        bookName : doc.data().bookName,
                        bookStatus : doc.data().bookStatus,
                        docId : doc.id
                    })
                }
            })
        })

    }

    componentDidMount(){
        this.getBookRequest()
        this.isBookRequestActive()
    }


    createRequest = async(bookName,reason) => {
        var userEmail = this.state.userEmail
        var randomRequestId = this.createUniqueId()
        db.collection('requestedBooks').add({
            'userEmail' : userEmail,
            'bookName' : bookName,
            'reason' : reason,
            'requestId' : randomRequestId,
            'bookStatus' : 'requested'
        })

        await this.getBookRequest()

        db.collection('users').where('userEmail', '==', userEmail).get().then()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                db.collection('users').doc(doc.id).update({
                    'isBookRequestActive' : true
                })
            })
        })

        this.setState({
            bookName : '',
            reason : '',
            requestId : randomRequestId
        })
    }

    
    isBookRequestActive(){
        db.collection('users').where('userEmail', '==', this.state.userEmail)
        .onSnapshot(querySnapshot => {
            querySnapshot.forEach(doc => {
                this.setState({
                    userDocId : doc.id,
                    isBookRequestActive : doc.data().isBookRequestActive
                })
            })
        })
    } 

    sendNotification = () => {
       db.collection('users').where('userEmail', '==', this.state.userEmail).get()
       .then(snapshot => {
           snapshot.forEach(doc => {
               var firstName = doc.data().firstName
               var lastName = doc.data().lastName
           
       

            db.collection('allNotifications').where('requestId', '==', this.state.requestId).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    
                    var donorId = doc.data().donorId
                    var bookName = doc.data().bookName

                    db.collection('allNotifications').add({
                        'message' : firstName + " " + lastName + " " + "recieved the book" + "" + bookName,
                        'bookName' : bookName,
                        'status' : 'unread',
                        'date' : firebase.firestore.FieldValue.serverTimestamp()
                    })
            })
        })
            })
        })
    
    }

    updateBookRequestStatus = () => {
        db.collection('requestedBooks').doc(this.state.docId).update({
            'bookStatus' : "recieved"
        })

        db.collection('users').where('userEmail', '==', this.state.userEmail).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                db.collection('users').doc(doc.id).update({
                    'isBookRequestActive' : false
                })
            })
        })
    }


    recievedBook = (bookName) => {
        var email = this.state.userEmail
        var requestId = this.state.requestId

        db.collection('recievedBooks').add({
            'userEmail' : email,
            'bookName' : bookName,
            'requestId': requestId,
            'bookStatus' : "recieved"
        })
    }

    async getBooksFromAPI(bookName){

        if(bookName.length > 2){
            var books = await GoogleBookSearch.searchbook(bookName,'AIzaSyBiNTX8HvwH_rGV7E6H0TISogq2IuHTqzc')
            
        this.setState({
            dataSource : books.data,
            showFlatList : true
        })
        }
    }

    keyExtracter = ({item,index}) => index.toString()
    renderItem = ({item,I}) => {
        return(
            <TouchableHighlight
            activeOpacity = {0.7}
            underlayColor = 'pink'
            onPress = {() => {
                this.setState({
                    showFlatList : false,
                    bookName : item.volumeInfo.title
                })
            }}
            bottomDivider
            >
                <Text> {item.volumeInfo.title} </Text>
            
            </TouchableHighlight>
        )
    }

    render(){
        if(this.state.isBookRequestActive === true){
            return(
                <View style = {{flex : 1}}>
                    <ImageBackground source = {require('../assets/Book.PNG')} style = {styles.image}
                    >
                    <View>
                        <Text style = {{alignSelf : 'center',textAlign : 'center',fontSize : 25, marginRight : 600}}> Book Name : {this.state.bookName} </Text>
                    </View>

                    <View>
                        <Text style = {{alignSelf : 'center', textAlign : "center", fontSize : 25, marginRight : 600}}> Book Status : {this.state.bookStatus} </Text>
                    </View>
                    </ImageBackground>
                    <View>
                        <TouchableOpacity 
                        style = {{
                                backgroundColor : 'black',
                                width : 290,
                                height : 30,
                                borderWidth : 2,
                                borderRadius : 11,
                                borderColor : 'blue',
                                marginRight : 600,
                                alignSelf : 'center',
                                marginBottom : 300,
                                marginLeft : 100
                        }}
                        onPress = {()=> {
                            this.sendNotification() 
                            this.updateBookRequestStatus()
                            this.recievedBook(this.state.bookName)
                            this.setState({
                                bookName : ''
                            }) 
                            }}>  

                            <Text style = {{fontSize : 20, textAlign : 'center',color : 'white'}}> I have recieved the book </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        } else {
            return(
                <View>
                    <ImageBackground source = {require('../assets/Book.PNG')} style = {styles.image}
                    >
                <MyHeader
                title = 'Request Book' navigation = {this.props.navigation}
                />

                <View>
                    <TextInput
                    style = {{
                        width : 250,
                        height : 50,
                        borderWidth : 2,
                        alignSelf : 'center',
                        marginTop : 120,
                        height : 50,
                        width : 250,
                        alignSelf : 'center',
                        justifyContent : 'center',
                        fontSize : 17,
                        marginRight : 600
                    }}
                    placeholder = 'Enter The Book Name'
                    placeholderTextColor = 'red'
                    onChangeText = {text => 
                        this.getBooksFromAPI(text)
                    }
                    onClear = {text => {
                        this.getBooksFromAPI('')
                    }}
                    value = {this.state.bookName}
                    />

                    {this.state.showFlatList 
                    ? (
                    <FlatList
                        keyExtractor = {this.keyExtracter}
                        renderItem = {this.renderItem}
                        data = {this.state.dataSource}
                        enableEmptySections = {true}
                    />
                    )    :    (
                        <View>
                        <TextInput
                        style = {{
                        width : 250,
                        height : 50,
                        borderWidth : 2,
                        alignSelf : 'center',
                        marginTop : 20,
                        height : 50,
                        alignSelf : 'center',
                        justifyContent : 'center',
                        fontSize : 17,
                        marginRight : 600
                    }}
                    placeholder = 'Why do you need this book?'
                    placeholderTextColor = 'red'
                    multiline = {true}
                    numberOfLines = {8}
                    onChangeText = {(text) => {
                        this.setState({
                                reason : text 
                        })
                    }}
                    value = {this.state.reason}
                    />


                    <TouchableOpacity style = {styles.button}
                    onPress = {()=> {
                        this.createRequest(this.state.bookName,this.state.reason)
                    }}>
                        <Text style = {styles.buttonText}> Request </Text>
                    </TouchableOpacity> 
                        </View>
                    )   }
                    
                    
                    </View>
                </ImageBackground>
                </View>
            )
        }
    }

}

const styles = StyleSheet.create({
    inputBox : {
        width : 250,
        height : 50,
        borderWidth : 2,
        alignSelf : 'center',
        marginTop : 50
    },
    button : {
        backgroundColor : 'black',
        width : 90,
        height : 30,
        borderWidth : 2,
        borderRadius : 11,
        borderColor : 'blue',
        alignSelf : 'center',
        marginTop : 20,
        marginRight : 600
      },
      buttonText : {
        color : 'white',
        textAlign : 'center',
        fontSize : 20
    },
    image: {
        flex: 1,
        justifyContent: "center",
        width : 1300,
        height : 1000
    }
})