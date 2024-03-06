import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import "../global.css";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SessionProvider } from "@/lib/providers/auth-provider";

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
