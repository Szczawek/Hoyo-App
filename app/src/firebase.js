// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqjkis4lec0vrHRBesXLNclTlaTsaGik8",
  authDomain: "stack-998d6.firebaseapp.com",
  projectId: "stack-998d6",
  storageBucket: "stack-998d6.appspot.com",
  messagingSenderId: "101716130518",
  appId: "1:101716130518:web:74fcad52b7a60740076777",
  measurementId: "G-XSGPGXZJRE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);