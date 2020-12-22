import React from 'react';
import {View, Text,TouchableOpacity} from 'react-native';
import {DrawerItems} from 'react-navigation-drawer';
import firebase from 'firebase';
import {Avatar} from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import db from '../config';

export default class CustomSideBarMenu extends React.Component{
   
   state = {
       userEmail : firebase.auth().currentUser.email,
       image : '#',
       name : ''
   }

   uploadImage = async (url,email) => {
        var response = await fetch(url) 
        var blob = await response.blob()
        var pictureRef = firebase.storage().ref().child('users/' + email)
        
        return pictureRef.put(blob).then(response => {
            this.fetchImage(email)
        })
   } 

   fetchImage = (imageName) => {
        var storageRef = firebase.storage().ref().child('users/' + imageName)
        storageRef.getDownloadURL().then(url => {
            this.setState({
                image : url
            })
        })
        .catch(error => {
            alert(error)

            this.setState({
                image : '#'
            })
        })
   }

   getUserProfile(){
       db.collection('users').where('userEmail', '==', this.state.userEmail)
       .onSnapshot(snapshot => {
           snapshot.forEach(doc => {
               this.setState({
                    name : doc.data().firstName + " " + doc.data().lastName
               })
           })
       })
   }

   selectPicture = async() => {
        const {cancelled, uri} = await ImagePicker.launchImageLibraryAsync({
            mediaTypes : ImagePicker.MediaTypeOptions.All,
            allowsEditing : true,
            aspect : [4,3],
            quality : 1 
        })

        if (!cancelled) {
            this.uploadImage(uri, this.state.email)
        }
   }

   componentDidMount(){
       this.getUserProfile()
       this.fetchImage(this.state.userEmail)
   }

   
    render(){
        return(
            <View style = {{flex :1}}>
                <View style = {{flex : 0.8}}>
                    <View style = {{flex : 0.5, backgroundColor : 'orange', alignItems : 'center'}}>
                        <Avatar
                            containerStyle = {{
                                //alignItems : 'center', 
                                flex : 0.75, 
                                width : '30%',
                                height : '20%',
                                borderRadius : 20,
                                marginTop : 20 }}
                            rounded
                            source = {{uri : this.state.image}}
                            size = 'medium'
                            onPress = { () => {
                                this.selectPicture()
                            }}
                        />
                        <Text style = {{
                            marginTop : 10,
                            fontSize : 20,
                            textAlign : 'center'
                        }}> {this.state.name} </Text>
                    </View>
                    <DrawerItems
                        {...this.props}
                    />
                </View>
                <View style = {{flex : 0.1, justifyContent:'flex-end',paddingBottom : 10}}>
                    <TouchableOpacity
                    style = {{
                        backgroundColor : 'black',
                        width : 90,
                        height : 30,
                        borderWidth : 2,
                        borderRadius : 11,
                        borderColor : 'blue',
                        alignSelf : 'center'
                    }}
                    onPress = {() => {
                        this.props.navigation.navigate('LoginScreen')
                        firebase.auth().signOut()
                    }}
                    >
                        <Text style = {{
                            color : 'white',
                            textAlign : 'center',
                            fontSize : 20
                        }}> Logout </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

