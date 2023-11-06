import { Text, View, TextInput, StyleSheet, Alert } from "react-native";
import { AuthStore, appSignIn } from "../../store.js";
import { Stack, useRouter } from "expo-router";
import { useRef } from "react";

const Login = () => {
    return (
        <View className="flex-1 items-center justify-center bg-background-light dark:bg-background-dark">
            <Text className="text-text dark:text-text-dark">Login</Text>
        </View>
    )
};


export default Login;

