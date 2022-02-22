// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD69-bH1pT_xe73tfolNGrfAaLQQxmJjB0",
  authDomain: "inventtaller.firebaseapp.com",
  databaseURL: "https://inventtaller-default-rtdb.firebaseio.com",
  projectId: "inventtaller",
  storageBucket: "inventtaller.appspot.com",
  messagingSenderId: "893082956206",
  appId: "1:893082956206:web:924d9b8be6832107ebd83f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export {app, database};