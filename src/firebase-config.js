import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDv-ViRiwlNKukYUMBnfDdcAFoRCRBLDOM",
  authDomain: "brainbox-aaa8a.firebaseapp.com",
  projectId: "brainbox-aaa8a",
  storageBucket: "brainbox-aaa8a.appspot.com",
  messagingSenderId: "937716920944",
  appId: "1:937716920944:web:134da92e03f0480ef53ab5"
  }; //if publishing use env vars

  const app = initializeApp(firebaseConfig);

  export const db = getFirestore(app);

  export const auth = getAuth(app);