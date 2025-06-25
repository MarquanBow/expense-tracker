import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC14LKCDrTulwNK_YoMUhgdRCnzg2x4r90",
  authDomain: "expense-tracker-f698b.firebaseapp.com",
  projectId: "expense-tracker-f698b",
  storageBucket: "expense-tracker-f698b.firebasestorage.app",
  messagingSenderId: "271962224870",
  appId: "1:271962224870:web:153a33ab18d5920e216327",
  measurementId: "G-SN4DSSVMLF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);
