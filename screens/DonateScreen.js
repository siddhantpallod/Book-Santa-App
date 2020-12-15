import React from 'react';
import { StyleSheet, Text, View,FlatList , TouchableOpacity} from 'react-native';
import MyHeader from '../components/MyHeader';
import db from '../config';
import firebase from 'firebase';
import { ListItem } from 'react-native-elements';

export default class DonateScreen extends React.Component{

    constructor(){
        super();
        this.requestRef = null

        this.state = {
            requestedBooks : []
        }
    }

    getRequestedBooksList = () => {
        this.requestRef = db.collection('requestedBooks')
        .onSnapshot((snapshot) => {
            var requestedBookList = snapshot.docs.map(document => document.data())
            this.setState({
                requestedBooks : requestedBookList
            })
        }) 
    }
    keyExtracter = (item,index) => index.toString()
    renderItem = ({item,I}) => {
        return(
            <ListItem
                key = {I}
                title = {item.bookName}
                subtitle = {item.reason}
                rightElement = {
                    <TouchableOpacity style = {styles.button}
                    onPress = {()=> {
                        this.props.navigation.navigate('RecieverDetails',{'details': item})
                    }}>
                        <Text style = {styles.buttonText}> View </Text>
                    </TouchableOpacity>
                }
                bottomDivider
            />
        )
    }

    componentDidMount(){
        this.getRequestedBooksList()
        
    }

    componentWillUnmount(){
        this.requestRef()
    }
    

    render(){
        return(
            <View>
                <MyHeader
                title = 'Donate Book' navigation ={this.props.navigation}
                />
                {this.state.requestedBooks.length === 0
                ? (
                    <View>
                        <Text> List Of All Requested Books </Text>
                     </View>   
                )
                : (<FlatList
                    keyExtractor = {this.keyExtracter}
                    data = {this.state.requestedBooks}
                    renderItem = {this.renderItem}
                />)
                }

            </View>
        )
    }
}

const styles = StyleSheet.create({
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
          }
    
})
