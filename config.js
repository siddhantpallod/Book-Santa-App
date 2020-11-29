import firebase from 'firebase';
require('@firebase/firestore');

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBiNTX8HvwH_rGV7E6H0TISogq2IuHTqzc",
    authDomain: "book-santa-app-b09e4.firebaseapp.com",
    databaseURL: "https://book-santa-app-b09e4.firebaseio.com",
    projectId: "book-santa-app-b09e4",
    storageBucket: "book-santa-app-b09e4.appspot.com",
    messagingSenderId: "307809993722",
    appId: "1:307809993722:web:d959985732e9af21451a43"
  };
  // Initialize Firebase
  const firebaseApp =  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  export default db;