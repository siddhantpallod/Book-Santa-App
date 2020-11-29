import React from 'react';
import { StyleSheet, Text, View ,TextInput,TouchableOpacity,Alert,Image,Modal,ScrollView,KeyboardAvoidingView, TouchableWithoutFeedback} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import SantaAnimation from '../components/Santa'

export default class LoginScreen extends React.Component{

    constructor(){
        super();
        this.state = {
            email : '',
            password : '',
            firstName : '',
            lastName : '',
            contactNo : '',
            userAddress : '',
            confirmPassword : '',
            isModalVisible : false
        }
    }

    userLogin = (email,password) => {
        firebase.auth().signInWithEmailAndPassword(email,password).then(()=>{
            return Alert.alert("Successful Login")
            
        })
        .catch((error)=> {
            var errorMessage = error.message
            return Alert.alert(errorMessage)
        })
        }
    

    userSignUp = (email,password,confirmPassword) => {
        if(password !== confirmPassword){
            return Alert.alert("Passwors don't match")
        }
        else{

        firebase.auth().createUserWithEmailAndPassword(email,password).then((response)=> {
            return Alert.alert("User Added Successfully")
        })

        .catch((error)=> {
            var errorMessage = error.message
            return Alert.alert(errorMessage)
        })
        db.collection('users').add({
            contactNo : this.state.contactNo,
            firstName : this.state.firstName,
            lastName : this.state.lastName,
            userAddress : this.state.userAddress,
            userEmail : this.state.email
        })
    }
    }

    showModal = () => {
        return(
            <Modal
            animationType = 'fade'
            transparent = {true}
            visible = {this.state.isModalVisible}
            >
            
            <View style = {styles.modalContainer}>
                <ScrollView>
                    <KeyboardAvoidingView>
                        <Text> Registration </Text>
                        <TextInput
                        style = {styles.inputBox}
                        placeholder = "First Name"
                        maxLength = {8}
                        onChangeText = {(text)=> {
                            this.setState({
                                firstName : text
                            })
                        }}
                        />
                        <TextInput
                        style = {styles.inputBox}
                        placeholder = "Last Name"
                        maxLength = {8}
                        onChangeText = {(text)=> {
                            this.setState({
                                lastName : text
                            })
                        }}
                        />
                        <TextInput
                        style = {styles.inputBox}
                        placeholder = "Contact Number"
                        maxLength = {10}
                        keyboardType = {"numeric"}
                        onChangeText = {(text)=> {
                            this.setState({
                                contactNo : text
                            })
                        }}
                        />
                        <TextInput
                        style = {styles.inputBox}
                        placeholder = "Address"
                        multiline = {true}
                        onChangeText = {(text)=> {
                            this.setState({
                                userAddress : text
                            })
                        }}
                        />
                        <TextInput
                        style = {styles.inputBox}
                        placeholder = "Email"
                        keyboardType = 'email-address'
                        onChangeText = {(text)=> {
                            this.setState({
                               email : text
                            })
                        }}
                        />
                        <TextInput
                        style = {styles.inputBox}
                        secureTextEntry = {true}
                        placeholder = "Password"
                        onChangeText = {(text)=> {
                            this.setState({
                               password : text
                            })
                        }}
                        />
                        <TextInput
                        style = {styles.inputBox}
                        secureTextEntry = {true}
                        placeholder = "Confirm Password"
                        onChangeText = {(text)=> {
                            this.setState({
                               confirmPassword : text
                            })
                        }}
                        />
                        <TouchableOpacity 
                        style = {{
                            backgroundColor : 'black',
                            width : 200,
                            height : 30,
                            justifyContent : 'center'
                        }}
                        onPress = {() => {
                            this.userSignUp(this.state.email,this.state.password,this.state.confirmPassword)}
                        }
                            >
                            <Text style = {{color : 'white', fontSize : 15}}> Register </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        style = {{
                            backgroundColor : 'black',
                            width : 200,
                            height : 30,
                            justifyContent : 'center'
                        }} 
                         onPress = {()=> {
                             this.setState({
                                 isModalVisible : false
                             })
                         }}
                         >
                            <Text style = {{color : 'white', fontSize : 15}}> Cancel </Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </ScrollView>
            </View>

            </Modal>
        )
    }
    
    render(){
        return(
            <View style = {styles.container}>
                <ScrollView>
                <View style = {{backgroundColor : 'black'}}>
                    <Text style = {styles.title}> Book Santa App </Text>
                </View>
                <View>
                <Image
                    style = {{
                        alignSelf : 'center',
                        width : 190,
                        height : 230,
                        marginTop : 30
                    }}
                    source = {require('../assets/Santa.png')}
                    />
                </View>
                <View>
                
                <TouchableOpacity style = {styles.signButton}
                onPress = {()=> this.setState({isModalVisible : true})}>

                    <Text style = {styles.buttonText}> Sign Up </Text>
                </TouchableOpacity>

                <TextInput
                style = {styles.inputBox}
                placeholder = "Email"
                keyboardType = 'email-address'
                onChangeText = {(text)=> {
                    this.setState({
                        email : text
                    })
                }}
                />

                <TextInput
                style = {styles.inputBox} 
                secureTextEntry = {true}
                placeholder = "Password"
                onChangeText = {(text)=> {
                    this.setState({
                        password : text
                    })
                }}
                />

                <TouchableOpacity style = {styles.loginButton} 
                onPress = {()=> {
                    this.userLogin(this.state.email,this.state.password)
                }}
                >
                    <Text style = {styles.buttonText}> Login </Text>
                </TouchableOpacity>

                </View>
                </ScrollView>
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
        //flex : 1,
        //justifyContent : 'center',
        //alignItems : 'center',
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
          marginTop : 30
      },
      buttonText : {
          color : 'white',
          textAlign : 'center',
          fontSize : 20
      },
      signButton : {
        backgroundColor : 'black',
        width : 90,
        height : 30,
        borderWidth : 2,
        borderRadius : 11,
        borderColor : 'blue',
        marginTop : 30,
        marginLeft : 250
      },
      modalContainer : {
          justifyContent : 'center',
          alignItems : 'center',
          backgroundColor : 'red',
          marginLeft : 50,
          marginTop : 100,
          marginRight : 50,
          marginBottom : 70,
          width : 100,
          height : 100
      }
})