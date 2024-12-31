// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvrty4zjeuNMYu8TuQuf49LihZWuiAlgE",
  authDomain: "preciosidades-de-trico.firebaseapp.com",
  databaseURL: "https://preciosidades-de-trico-default-rtdb.firebaseio.com",
  projectId: "preciosidades-de-trico",
  storageBucket: "preciosidades-de-trico.firebasestorage.app",
  messagingSenderId: "53723311991",
  appId: "1:53723311991:web:b32af8acafada569287b72"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exporta o Firestore
export const db = getFirestore(app);
