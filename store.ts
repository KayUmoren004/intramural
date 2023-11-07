import { Store, registerInDevtools } from "pullstate";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  initializeAuth,
  sendEmailVerification,
  deleteUser,
  updateProfile,
} from "firebase/auth";

import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  arrayRemove,
  serverTimestamp,
  arrayUnion,
  addDoc,
  limitToLast,
  where,
} from "firebase/firestore";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getDatabase,
  child,
  get,
  onValue,
  ref as dbRef,
  query,
  push,
  onChildAdded,
  off,
  set,
  onDisconnect,
  remove,
  serverTimestamp as dbServerTimestamp,
  orderByChild,
  update,
} from "firebase/database";

import { app, auth, db, realtime, storage } from "./firebase-config";

import type { User } from "./src/lib/types/entities";
import { Platform } from "react-native";

// Types
type StoreType = {
  isLoggedIn: boolean;
  initialized: boolean;
  user: User | null | any;
};

// Type
type schoolListType = {
  label: string;
  value: string;
};

export const AuthStore = new Store<StoreType>({
  isLoggedIn: false,
  initialized: false,
  user: null,
});

const unsub = onAuthStateChanged(auth, (user) => {
  console.log("onAuthStateChange", user);
  AuthStore.update((store: StoreType) => {
    store.user = user;
    store.isLoggedIn = user ? true : false;
    store.initialized = true;
  });
});

export const appSignIn = async (email: string, password: string) => {
  try {
    const resp = await signInWithEmailAndPassword(auth, email, password);
    AuthStore.update((store: StoreType) => {
      store.user = resp.user;
      store.isLoggedIn = resp.user ? true : false;
    });
    return { user: auth.currentUser };
  } catch (e: any) {
    return { error: e };
  }
};

export const appSignOut = async () => {
  try {
    await signOut(auth);
    AuthStore.update((store) => {
      store.user = null;
      store.isLoggedIn = false;
    });
    return { user: null };
  } catch (e) {
    return { error: e };
  }
};

export const appSignUp = async (user: any) => {
  try {
    // this will trigger onAuthStateChange to update the store..
    const resp = await createUserWithEmailAndPassword(
      auth,
      user.email,
      user.password
    );

    // Get UID
    const uid = auth.currentUser?.uid;
    let profilePhotoUrl: any = "default";

    let schoolId = "";

    // Look in the school collection for the school with the domain
    const schoolQuerySnapshot: any = await getDocs(
      query(
        collection(db, "schools") as any,
        where("domain", "==", user.schoolDomain) as any
      ) as any
    );

    console.log("schoolQuerySnapshot", schoolQuerySnapshot);

    // If the school exists, get the id
    if (schoolQuerySnapshot.size > 0) {
      schoolId = schoolQuerySnapshot.docs[0].id;
    }

    console.log("schoolId", schoolId);

    // Create firestore user collection
    await setDoc(doc(db, "users", uid), {
      name: user.name,
      email: user.email,
      role: user.role ?? "CLIENT",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      bio: user.bio ?? "",
      emailVerified: false,
      image: profilePhotoUrl,
      username: user.username ?? "",
      signUpDate: new Date(),
      lastLogin: new Date(),
      schoolId: schoolId,
      schoolDomain: user.schoolDomain,
    });

    // add the displayName
    // await updateProfile(resp.user, { displayName });

    if (user.profilePhoto) {
      profilePhotoUrl = await uploadProfilePhoto(user.profilePhoto);
    }

    delete user.actualPassword;

    AuthStore.update((store) => {
      store.user = auth.currentUser;
      store.isLoggedIn = true;
    });

    return { user: auth.currentUser };
  } catch (e: any) {
    return { error: e };
  }
};

// Upload Profile Photo
const uploadProfilePhoto = async (uri: any) => {
  const uid = auth.currentUser?.uid;
  try {
    // console.log("Init, ", uri);
    const photo: any = await getBlob(uri);
    // console.log("Modified URI: ", photo);
    // const photo = await fetch(uri).then((r) => r.blob());
    // console.log("0");
    const imageRef: any = ref(storage, `profilePhotos/${uid}/photo.jpg`);
    // console.log("1");
    await uploadBytes(imageRef, photo);
    // console.log("2");

    const url = await getDownloadURL(imageRef);
    // console.log("3");

    await updateDoc(doc(db, "users", uid), {
      profilePhotoUrl: url,
    });
    // console.log("4");

    return url;
  } catch (err: any) {
    console.log("Error @Firebase.uploadProfilePhoto: ", err.message);
  }
};

// Get blob from uri
const getBlob = async (uri: string) => {
  return await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = () => {
      resolve(xhr.response);
    };

    xhr.onerror = () => {
      reject(new Error("Network request failed"));
    };

    // Replace "file://" with "" if platform is ios

    const modifiedURI =
      Platform.OS === "ios" ? uri.replace("file://", "") : uri;

    xhr.responseType = "blob";
    xhr.open("GET", modifiedURI, true);
    xhr.send(null);
  });
};

// Get School List from Firestore
export const getSchoolList = async () => {
  try {
    const schoolList: schoolListType[] = [];
    const querySnapshot: any = await getDocs(collection(db, "schools"));
    querySnapshot.forEach((doc: any) => {
      schoolList.push({
        label: doc.data().name,
        value: doc.data().domain,
      });
    });

    console.log("List: ", schoolList);
    return { schoolList };
  } catch (e: any) {
    return { error: e };
  }
};

registerInDevtools({ AuthStore });
