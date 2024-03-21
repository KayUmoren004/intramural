import "react-native-reanimated";
import "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import "../global.css";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SessionProvider } from "@/lib/providers/auth-provider";
import { Image } from "expo-image";

const queryClient = new QueryClient();

const Layout = () => {
  const { colorScheme } = useColorScheme();
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <SafeAreaProvider>
          <Slot />
          <StatusBar style={colorScheme === "light" ? "dark" : "light"} />
        </SafeAreaProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default Layout;
