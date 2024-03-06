import useColor from "@/lib/colors/useColors";
import { Stack } from "expo-router/stack";

export default function Layout() {
  const colors = useColor();

  const background = colors.PRIMARY;
  const text = colors.TEXT;

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: background,
        },
        headerTintColor: text,
        headerTitle: "",
      }}
    />
  );
}
