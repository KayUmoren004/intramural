import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
} from "react-native";

import * as SplashScreen from "expo-splash-screen";

import { Slot, Stack } from "expo-router";

// Keep the splash screen visible while we fetch resources
// SplashScreen.preventAutoHideAsync();

const Layout = () => {
  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
          <Slot />
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Layout;
