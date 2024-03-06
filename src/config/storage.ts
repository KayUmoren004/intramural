import * as SecureStore from "expo-secure-store";

// Secure Storage
export const saveToSecureStore = async (key: string, value: any) => {
  try {
    const data = JSON.stringify(value);
    await SecureStore.setItemAsync(key, data);
  } catch (e: any) {
    console.log("Error saving to SecureStore (storage.ts): ", e);
    throw e;
  }
};

// Get data from Secure Storage
export const getFromSecureStore = async (key: string) => {
  try {
    const data = await SecureStore.getItemAsync(key);
    return data !== null ? JSON.parse(data) : null;
  } catch (e: any) {
    console.log("Error getting from SecureStore (storage.ts): ", e);
    throw e;
  }
};

// Delete data from Secure Storage
export const deleteFromSecureStore = async (key: string) => {
  console.log("Deleting from SecureStore: ", key);
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (e: any) {
    console.log("Error deleting from SecureStore (storage.ts): ", e);
    throw e;
  }
};
