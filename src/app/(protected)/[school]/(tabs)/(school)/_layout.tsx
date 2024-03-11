import useColor from "@/lib/colors/useColors";
import { Stack } from "expo-router/stack";

export default function Layout() {
  const colors = useColor();

  const background = colors.BACKGROUND;
  const primary = colors.PRIMARY;
  const text = colors.TEXT;

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: primary,
        },
        headerTintColor: text,
        headerTitle: "",
        contentStyle: {
          backgroundColor: background,
        },
      }}
    />
  );
}
