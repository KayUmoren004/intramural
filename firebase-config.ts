import { getApp, getApps, initializeApp } from "firebase/app";
import * as firebaseAuth from "firebase/auth";
import { initializeAuth, getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBqAICw4HUJRsqjo91K2exnbL7VoY20Q98",
  authDomain: "intramural-a5ee1.firebaseapp.com",
  projectId: "intramural-a5ee1",
  storageBucket: "intramural-a5ee1.appspot.com",
  messagingSenderId: "582398475168",
  appId: "1:582398475168:web:e8dde71d14626f72f2c2c5",
};

// export const app = initializeApp(firebaseConfig);

const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;
// export const auth = initializeAuth(app, {
//   persistence: reactNativePersistence(AsyncStorage),
// });

// export const db = getFirestore(app);
// export const realtime = getDatabase(app);
// export const storage = getStorage(app);

// Initialize Firebase
let app: any, auth: any, db: any, storage: any, realtime: any;

if (getApps.length < 1) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: reactNativePersistence(AsyncStorage),
  });
  db = getFirestore(app);
  realtime = getDatabase(app);
  storage = getStorage(app);
} else {
  app = getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  realtime = getDatabase(app);
  storage = getStorage(app);
}

export { app, auth, db, realtime, storage };
