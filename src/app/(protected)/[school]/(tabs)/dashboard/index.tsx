import { useSession } from "@/lib/providers/auth-provider";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, View, Button } from "react-native";

export default function App() {
  const { school } = useLocalSearchParams<{ school: string }>();
  const { push } = useRouter();
  const { signOut } = useSession();

  return (
    <View className="flex-1 items-center justify-center bg-background-light dark:bg-background-dark">
      <Text className="text-text-light dark:text-red-500">Dash</Text>
      <Button title="Site Map" onPress={() => push("/_sitemap")} />
      <Button title="Logout" onPress={() => signOut()} />
    </View>
  );
}
