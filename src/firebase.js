import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA8PM1fnmKMpy7Grs88sxuFiu29WxME96o",
  authDomain: "polla-7b2ae.firebaseapp.com",
  projectId: "polla-7b2ae",
  storageBucket: "polla-7b2ae.firebasestorage.app",
  messagingSenderId: "884003355016",
  appId: "1:884003355016:web:87577d941159c3cf1aa23d",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
