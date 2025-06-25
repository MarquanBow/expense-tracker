// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC14LKCDrTulwNK_YoMUhgdRCnzg2x4r90",
  authDomain: "expense-tracker-f698b.firebaseapp.com",
  projectId: "expense-tracker-f698b",
  storageBucket: "expense-tracker-f698b.firebasestorage.app",
  messagingSenderId: "271962224870",
  appId: "1:271962224870:web:153a33ab18d5920e216327",
  measurementId: "G-SN4DSSVMLF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);