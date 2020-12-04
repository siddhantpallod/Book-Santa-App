import React from 'react';
import  {View,Text,TextInput,TouchableOpacity,StyleSheet,Alert} from 'react-native';
import MyHeader from '../components/MyHeader';
import db from '../config';
import firebase from 'firebase';

export default class SettingsScreen extends React.Component{

    constructor(){
        super();
        this.state = {
            email : '',
            firstName : '',
            lastName : '',
            contactNo : '',
            userAddress : '',
            docId : ''
        }
    }

    getUserDetails = () => {
        var email = firebase.auth().currentUser.email
        db.collection('users').where('userEmail', '==', email).get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                var details = doc.data()
                this.setState({
                   firstName : details.firstName,
                   lastName : details.lastName,
                   contactNo : details.contactNo,
                   userAddress : details.userAddress,
                   docId : doc.id
                })
            })
        })
    }
    componentDidMount(){
        this.getUserDetails()
    }

    updateDetails = () => {
        db.collection('users').doc(this.state.docId).update({
            firstName : this.state.firstName,
            lastName : this.state.lastName,
            contactNo : this.state.contactNo,
            userAddress : this.state.userAddress
        })

        return Alert.alert("User details successfully updated")
    }

    render(){
        return(
            <View style = {styles.container}> 
                <MyHeader
                style = {styles.title}
                title = 'Settings'
                navigation = {this.props.navigation}
                />

                <View>
                    <TextInput
                    style = {styles.inputBox}
                    placeholder = 'First Name'
                    maxLength = {8}
                    onChangeText = {(text) => {
                        this.setState({
                            firstName : text
                        })
                    }}
                    value = {this.state.firstName}
                    />
                    <TextInput
                    style = {styles.inputBox}
                    placeholder = 'Last Name'
                    maxLength = {8}
                    onChangeText = {(text) => {
                        this.setState({
                            lastName : text
                        })
                    }}
                    value = {this.state.lastName}
                    />
                    <TextInput
                    style = {styles.inputBox}
                    placeholder = 'Contact No'
                    maxLength = {10}
                    keyboardType = 'numeric'
                    onChangeText = {(text) => {
                        this.setState({
                            contactNo : text
                        })
                    }}
                    value = {this.state.contactNo}
                    />
                    <TextInput
                    style = {styles.inputBox}
                    placeholder = 'Address'
                    multiline = {true}
                    onChangeText = {(text) => {
                        this.setState({
                            userAddress : text
                        })
                    }}
                    value = {this.state.userAddress}
                    />
                </View>
                <View>
                    <TouchableOpacity style = {styles.loginButton}
                    onPress = {()=> {
                        this.updateDetails()
                    }}
                    >
                        <Text style = {styles.buttonText}> Save </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    title : {
        color : 'red',
        fontSize : 30,
        textAlign : 'center',
        marginTop : 40
    },
    container: {
        backgroundColor : 'cyan'
      },
      inputBox : {
          width : 250,
          height : 50,
          borderWidth : 2,
          alignSelf : 'center',
          marginTop : 50
      },
      loginButton : {
          backgroundColor : 'black',
          width : 100,
          height : 50,
          borderWidth : 2,
          borderRadius : 11,
          alignSelf : 'center',
          borderColor : 'blue',
          marginTop : 30,
          marginBottom : 50
      },
      buttonText : {
          color : 'white',
          textAlign : 'center',
          fontSize : 20
      },
})