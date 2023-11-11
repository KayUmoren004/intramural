import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Layout = () => {
  const { colorScheme } = useColorScheme();
  return (
    <SafeAreaProvider>
      <Slot />
      <StatusBar style={colorScheme === "light" ? "dark" : "light"} />
    </SafeAreaProvider>
  );
};

export default Layout;
