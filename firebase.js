// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth"; // TODO: Add SDKs for Firebase products that you want to use
import { getFirestore, doc, setDoc } from "firebase/firestore";
import {
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANqAldWV5xGifZY3lDV_DCJDt8H1ixt7c",
  authDomain: "bank-c3114.firebaseapp.com",
  projectId: "bank-c3114",
  storageBucket: "bank-c3114.appspot.com",
  messagingSenderId: "631272751576",
  appId: "1:631272751576:web:114a2aff4ef414477eb2ad",
  measurementId: "G-VFPZENRCP7",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export {
  auth,
  firestore,
  doc,
  setDoc,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
};
