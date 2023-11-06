import { Slot, SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import React from "react";



const Layout = () => {

  
    const { colorScheme } = useColorScheme();
    return (
        <>
        <Slot />
        <StatusBar style={colorScheme === "light" ? "dark" : "light"} />
        </>
    )
}

export default Layout;