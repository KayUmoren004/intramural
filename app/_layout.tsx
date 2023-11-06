import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";

const MainLayout = () => {
    const { colorScheme } = useColorScheme();
    return (
        <>
        <Slot />
        <StatusBar style={colorScheme === "light" ? "dark" : "light"} />
        </>
    )
}

export default MainLayout;