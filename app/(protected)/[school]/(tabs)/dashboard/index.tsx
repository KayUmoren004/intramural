import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Appearance,
  useColorScheme,
  Button,
} from "react-native";
import { appSignOut } from "../../../../../store";

export default function App() {
  const { school } = useLocalSearchParams<{ school: string }>();
  console.log(school);
  return (
    <View className="flex-1 items-center justify-center bg-background-light dark:bg-background-dark">
      <Text className="text-text-light dark:text-text-dark">Dash</Text>
      <Button title="Logout" onPress={() => appSignOut()} />
    </View>
  );
}
