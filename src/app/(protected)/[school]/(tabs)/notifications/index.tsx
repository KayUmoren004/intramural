import { useGlobalSearchParams } from "expo-router";

import { Text, View } from "react-native";

export default function App() {
  const { school } = useGlobalSearchParams();

  return (
    <View className="flex-1 items-center justify-center bg-background-light dark:bg-background-dark">
      <Text className="text-text-light dark:text-text-dark">Notifications</Text>
    </View>
  );
}
