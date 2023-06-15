// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app")
const { getAuth } = require("firebase/auth")
// const { getAnalytics } = require("firebase/analytics")
const { getFirestore } = require("firebase/firestore/lite")
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAEeWgr7_P8pc237nFYFnnJ_LrelfUkgjA",
  authDomain: "ostomy-watch.firebaseapp.com",
  projectId: "ostomy-watch",
  storageBucket: "ostomy-watch.appspot.com",
  messagingSenderId: "43076493542",
  appId: "1:43076493542:web:bd2b00ee9f47a48d59db27",
  measurementId: "G-9JHFP67739",
};

// Initialize Firebase
const FirebaseApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(FirebaseApp);

const FirebaseAuth = getAuth(FirebaseApp);
const FirebaseDB = getFirestore(FirebaseApp);

exports.FirebaseAuth = FirebaseAuth;
exports.FirebaseDB = FirebaseDB;
exports.FirebaseApp = FirebaseApp;