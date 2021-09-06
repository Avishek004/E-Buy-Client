import firebase from "firebase/app";
import "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDjU-BQ-KP8u_bOPr7YxCKGy-TKdsQUhKg",
    authDomain: "e-buy-04.firebaseapp.com",
    projectId: "e-buy-04",
    storageBucket: "e-buy-04.appspot.com",
    messagingSenderId: "959342736182",
    appId: "1:959342736182:web:3a1a8faa4484fb4dd7b997"
};

// Initialize Firebase
if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

// Export
export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();