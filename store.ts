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

  import { app, auth } from "./firebase-config";

  import type { User } from "./src/lib/types/entities";

  // Types
  type StoreType = {
    isLoggedIn: boolean;
    initialized: boolean;
    user: User | null | any;
  }

  export const AuthStore = new Store<StoreType>({
    isLoggedIn: false,
    initialized: false,
    user: null,
  })

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
    } catch (e) {
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
  
  export const appSignUp = async (email: string, password: string, displayName: string) => {
    try {
      // this will trigger onAuthStateChange to update the store..
      const resp = await createUserWithEmailAndPassword(auth, email, password);
  
      // add the displayName
      await updateProfile(resp.user, { displayName });
  
      AuthStore.update((store) => {
        store.user = auth.currentUser;
        store.isLoggedIn = true;
      });
  
      return { user: auth.currentUser };
    } catch (e) {
      return { error: e };
    }
  };
  
  registerInDevtools({ AuthStore });