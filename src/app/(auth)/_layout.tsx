import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

import { Stack, useRouter } from "expo-router";
import useColor from "@/lib/colors/useColors";
import { Feather } from "@expo/vector-icons";

const Layout = () => {
  const colors = useColor();
  const { back } = useRouter();

  const textColor = colors.TEXT;
  const bgColor = colors.BACKGROUND;

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView className="bg-background-light dark:bg-background-dark flex-1">
          <Stack
            screenOptions={{
              headerShown: false,
            }}
            initialRouteName="login"
          >
            <Stack.Screen name="login" />
            <Stack.Screen name="create/sign-up-1" />
            <Stack.Screen name="create/sign-up-2" />
            <Stack.Screen name="actions/forgot" />
            <Stack.Screen name="actions/verify" />
            <Stack.Screen
              name="modal"
              options={{
                presentation: "modal",
                headerShown: true,
                headerTitle: "Select School",
                headerStyle: {
                  backgroundColor: bgColor,
                },
                headerTintColor: textColor,
                headerTitleStyle: {
                  fontWeight: "bold",
                },
                headerRight: () => (
                  <TouchableOpacity onPress={() => back()}>
                    <Feather name="x" size={24} color={colors.ERROR} />
                  </TouchableOpacity>
                ),
              }}
            />
          </Stack>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Layout;
