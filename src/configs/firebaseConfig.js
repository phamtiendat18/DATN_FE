import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  push,
  serverTimestamp,
  onChildAdded,
  onValue,
} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD0-XLwhMSz4Yog9PqlBFB21ljiuX-EWLE",
  authDomain: "teleheal-2e5bc.firebaseapp.com",
  databaseURL:
    "https://teleheal-2e5bc-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "teleheal-2e5bc",
  storageBucket: "teleheal-2e5bc.firebasestorage.app",
  messagingSenderId: "358831335429",
  appId: "1:358831335429:web:43d8b4fcb9441dd86d546c",
  measurementId: "G-8CE4C3Z5DV",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, set, push, serverTimestamp, onChildAdded, onValue };
