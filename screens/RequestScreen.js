import React from 'react';
import { StyleSheet, Text, View,TextInput,TouchableOpacity,KeyboardAvoidingView } from 'react-native';
import MyHeader from '../components/MyHeader';
import db from '../config';
import firebase from 'firebase';

export default class RequestScreen extends React.Component{

    constructor(){
        super();

        this.state = {
            userEmail : firebase.auth().currentUser.email,
            bookName : '',
            reason : ''
        }
    }

    createUniqueId(){
        return Math.random().toString(36).substring(7)
    }

    createRequest = (bookName,reason) => {
        var userEmail = this.state.userEmail
        var randomRequestId = this.createUniqueId()
        db.collection('requestedBooks').add({
            'userEmail' : userEmail,
            'bookName' : bookName,
            'reason' : reason,
            'requestId' : randomRequestId
        })
        this.setState({
            bookName : '',
            reason : ''
        })
    }

    render(){
        return(
            <View>
               <MyHeader
               title = 'Request Book' navigation ={this.props.navigation}
               />
               <KeyboardAvoidingView>
                   <TextInput
                   style = {styles.inputBox, {width : 300}}
                   placeholder = 'Enter The Book Name'
                   onChangeText = {(text) => {
                       this.setState({
                            bookName : text 
                       })
                   }}
                   value = {this.state.bookName}
                   />

                <TextInput
                   style = {styles.inputBox, {height : 150}}
                   placeholder = 'Why do you need this book?'
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
                   }}
                   >
                       <Text style = {styles.buttonText}> Request </Text>
                   </TouchableOpacity>
               </KeyboardAvoidingView>
            </View>
        )
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
        alignSelf : 'center'
      },
      buttonText : {
        color : 'white',
        textAlign : 'center',
        fontSize : 20
    },

})