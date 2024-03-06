import useColor from "@/lib/colors/useColors";
import { useSession } from "@/lib/providers/auth-provider";
import { Feather } from "@expo/vector-icons";
import { Redirect, Slot, Stack, useRouter } from "expo-router";
import { Text, ActivityIndicator, View, TouchableOpacity } from "react-native";

export default function AppLayout() {
  const { session, isLoading } = useSession();

  const colors = useColor();
  const { back } = useRouter();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background-light dark:bg-background-dark">
        <ActivityIndicator size="large" color={colors.PRIMARY} />
      </View>
    );
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/login" />;
  }

  const textColor = colors.TEXT;
  const bgColor = colors.BACKGROUND;

  // This layout can be deferred because it's not the root layout.
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="[school]/modal"
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
      <Stack.Screen
        name="[school]/(tabs)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
  // return <Slot />;
}
