import { Store, createAsyncAction, registerInDevtools } from "pullstate";
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
  DocumentData,
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
export type StoreType = {
  isLoggedIn: boolean;
  initialized: boolean;
  user: any;
  userData: any;
  slug: string | null;
  schoolList: any;
};

type schoolListType = {
  label: string;
  value: string;
};

type updateUserData = {
  field: string;
  value: any;
};

export const AuthStore = new Store<StoreType>({
  isLoggedIn: false,
  initialized: false,
  user: null,
  userData: null,
  slug: null,
  schoolList: null,
});

// Get User
export const getCurrentUser = async () => {
  try {
    const user = auth.currentUser;
    return { user };
  } catch (e: any) {
    return { error: e };
  }
};

// Get User Data - firestore
export const getUserData = async () => {
  try {
    const uid = auth.currentUser?.uid;
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return { userData: data };
    } else {
      return { userData: null };
    }
  } catch (e: any) {
    return { error: e };
  }
};

// Update User data - firestore
export const updateUserData = async (data: updateUserData) => {
  try {
    const uid = auth.currentUser?.uid;
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, {
      [data.field]: data.value,
    });
    return { success: true };
  } catch (e: any) {
    return { error: e };
  }
};

// Get User domain - firestore
const getSlug = async () => {
  try {
    const uid = auth.currentUser?.uid;
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const slug = data?.domain.split(".")[0];
      return { slug };
    } else {
      return { slug: null };
    }
  } catch (e: any) {
    return { error: e };
  }
};

const unsub = onAuthStateChanged(auth, async (user) => {
  console.log("onAuthStateChange", user);
  // AuthStore.update((store: StoreType) => {
  //   store.user = user;
  //   store.isLoggedIn = user ? true : false;
  //   store.initialized = true;
  //   store.slug = user?.email ? user.email.split("@")[1].split(".")[0] : null;
  //   store.userData = user ? getUserData() : null;
  // });
  const schoolListResult = await getSchoolList();
  if (user) {
    // Fetch the user data from Firestore
    const userDataResult = await getUserData();

    // Update the AuthStore with the fetched user data
    AuthStore.update((store: StoreType) => {
      store.user = user;
      store.isLoggedIn = true;
      store.initialized = true;
      store.slug = user.email ? user.email.split("@")[1].split(".")[0] : null;
      store.schoolList = schoolListResult.schoolList;
      store.userData = userDataResult.userData;
    });
  } else {
    // User is signed out
    AuthStore.update((store: StoreType) => {
      store.user = null;
      store.isLoggedIn = false;
      store.initialized = true;
      store.userData = null;
      store.schoolList = schoolListResult.schoolList;
    });
  }
});

export const appSignIn = async (email: string, password: string) => {
  try {
    const resp = await signInWithEmailAndPassword(auth, email, password);

    // Update last sign in date
    const data:updateUserData = {
      field: "lastLogin",
      value: serverTimestamp(),
    }

    await updateUserData(data);

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
    const resp = await createUserWithEmailAndPassword(
      auth,
      user.email,
      user.password
    );

    // Get UID
    const uid = auth.currentUser?.uid;
    let profilePhotoUrl: any = "default";
    let localProfilePhoto: any = user.profilePhoto;

    let schoolId = "";

    // Look in the school collection for the school with the domain
    const schoolQuerySnapshot: any = await getDocs(
      query(
        collection(db, "schools") as any,
        where("domain", "==", user.schoolDomain) as any
      ) as any
    );

    // If the school exists, get the id
    if (schoolQuerySnapshot.size > 0) {
      schoolId = schoolQuerySnapshot.docs[0].id;
    }

        // If a profile photo is provided, upload it
        if (user.profilePhoto) {
          profilePhotoUrl = await uploadImage(user.profilePhoto);
          if (!profilePhotoUrl) {
            console.error('Error uploading profile photo');
            // Handle the error (e.g., set a default image or retry upload)
            profilePhotoUrl = 'default';
          }
        }

    // Create firestore user collection
    await setDoc(doc(db, "users", uid), {
      name: user.name,
      email: user.email,
      role: user.role ?? "CLIENT",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      bio: user.bio ?? "",
      emailVerified: false,
      image: {
        local: localProfilePhoto,
        url: profilePhotoUrl,
      },
      username: user.username ?? "",
      signUpDate: new Date(),
      lastLogin: new Date(),
      schoolId: schoolId,
      schoolDomain: user.schoolDomain,
    });

    delete user.actualPassword;

    // Get Userdata from firestore
    const userDataResult = await (await getUserData()).userData;

    AuthStore.update((store) => {
      store.user = auth.currentUser;
      store.userData = userDataResult;
      store.isLoggedIn = true;
    });

    return { user: auth.currentUser, userData: userDataResult };
  } catch (e: any) {
    return { error: e };
  }
};

// Reset Password
export const appResetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (e: any) {
    return { error: e };
  }
};

// Verify User Email
export const appVerifyEmail = async () => {
  try {
    await sendEmailVerification(auth.currentUser!);

    // Update user data
    const data: updateUserData = {
      field: "emailVerified",
      value: "true",
    };

    const updated = await updateUserData(data);

    if (updated.success) {
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (e: any) {
    return { error: e };
  }
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
    return { schoolList };
  } catch (e: any) {
    return { error: e };
  }
};

// Function to upload image to Firebase Storage
const uploadImage = async (imageUri: string) => {
  const uid = auth.currentUser?.uid; // Get current user's UID
  const storage = getStorage();
  const imageRef = ref(storage, `profilePhotos/${uid}`);

  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Upload image
    await uploadBytes(imageRef, blob);

    // Get the download URL
    const downloadURL = await getDownloadURL(imageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image: ', error);
    return null;
  }
};

// Function to update Firestore document
const updateFirestoreImage = async (imageUrl: string) => {
  const db = getFirestore();
  const uid = auth.currentUser?.uid;
  const userDocRef = doc(db, 'users', uid);

  try {
    await updateDoc(userDocRef, { image: imageUrl });
    console.log('Firestore document updated with image URL');
  } catch (error) {
    console.error('Error updating Firestore: ', error);
  }
};


registerInDevtools({ AuthStore });

// Upload Profile Photo
// const uploadProfilePhoto = async (uri: any) => {
//   const uid = auth.currentUser?.uid;
//   try {
//     // console.log("Init, ", uri);
//     const photo: any = await getBlob(uri);
//     // console.log("Modified URI: ", photo);
//     // const photo = await fetch(uri).then((r) => r.blob());
//     // console.log("0");
//     const imageRef: any = ref(storage, `profilePhotos/${uid}/photo.jpg`);
//     // console.log("1");
//     await uploadBytes(imageRef, photo);
//     // console.log("2");

//     const url = await getDownloadURL(imageRef);
//     // console.log("3");

//     await updateDoc(doc(db, "users", uid), {
//       profilePhotoUrl: url,
//     });
//     // console.log("4");

//     return url;
//   } catch (err: any) {
//     console.log("Error @Firebase.uploadProfilePhoto: ", err.message);
//   }
// };

// Get blob from uri
// const getBlob = async (uri: string) => {
//   return await new Promise((resolve, reject) => {
//     const xhr = new XMLHttpRequest();

//     xhr.onload = () => {
//       resolve(xhr.response);
//     };

//     xhr.onerror = () => {
//       reject(new Error("Network request failed"));
//     };

//     // Replace "file://" with "" if platform is ios

//     const modifiedURI =
//       Platform.OS === "ios" ? uri.replace("file://", "") : uri;

//     xhr.responseType = "blob";
//     xhr.open("GET", modifiedURI, true);
//     xhr.send(null);
//   });
// };
