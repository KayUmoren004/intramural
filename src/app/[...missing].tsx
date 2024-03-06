import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="flex flex-1 items-center justify-center p-5 bg-background-light dark:bg-background-dark">
        <Text className="font-bold text-2xl text-text-light dark:text-text-dark">
          This screen doesn't exist.
        </Text>

        <Link href="/" className="mt-3 py-3">
          <Text className="text-md text-primary-light dark:text-primary-dark">
            Go to home screen!
          </Text>
        </Link>
      </View>
    </>
  );
}
