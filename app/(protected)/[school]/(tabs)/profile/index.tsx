import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Appearance,
  useColorScheme,
  Button,
  ActivityIndicator,
} from "react-native";
import { AuthStore, appSignOut, getUserData } from "../../../../../store";
import { createAsyncAction, errorResult, successResult } from "pullstate";
import useColor from "../../../../../src/lib/colors/useColors";

export default function App() {
  const { school } = useLocalSearchParams<{ school: string }>();

  const Colors = useColor();
  const userData = JSON.stringify(AuthStore.useState().userData);

  const signOut = async () => {
    const result = await appSignOut();
    if (result.error) {
      console.log("Error signing out");
    }

    if (result.user === null) {
      router.replace("/");
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-background-light dark:bg-background-dark">
      <Text className="text-text-light dark:text-text-dark">{userData}</Text>
      <Button title="Logout" onPress={() => appSignOut()} />
    </View>
  );
}
