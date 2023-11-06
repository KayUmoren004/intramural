import {
    Keyboard,
    KeyboardAvoidingView,
    SafeAreaView,
    TouchableWithoutFeedback,
  } from "react-native";

  import { Stack } from "expo-router";

  const Layout = () => {
    return (
        <KeyboardAvoidingView className="flex-1" behavior="padding">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
                    <Stack screenOptions={{
                        headerShown: false,
                    }} />
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
  }

    export default Layout;