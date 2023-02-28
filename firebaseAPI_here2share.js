//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
var firebaseConfig = {
    apiKey: "AIzaSyAP4znVmC4XYkCRivKFFjbvIip9bS9_lMY",
    authDomain: "here2share.firebaseapp.com",
    projectId: "here2share",
    storageBucket: "here2share.appspot.com",
    messagingSenderId: "293427918354",
    appId: "1:293427918354:web:897baf04ab7f099c624acb",
    measurementId: "G-3NRZ7YN522"
};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();