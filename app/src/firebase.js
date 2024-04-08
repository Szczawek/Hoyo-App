// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: procces.env.API_KEY,
  authDomain: procces.env.AUTH_DOMAIN,
  projectId: procces.env.PROJECT_ID,
  storageBucket: procces.env.STORAGE_BUCKET,
  messagingSenderId: procces.env.MESSAGING_SENDER_ID,
  appId: procces.env.APP_ID,
  measurementId: procces.env.MEASUREMENT_ID,
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
