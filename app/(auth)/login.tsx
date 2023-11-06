import { Text, View, TextInput, StyleSheet, Alert, Button } from "react-native";
import { AuthStore, appSignIn } from "../../store";
import { Stack, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import useColor from "../../src/lib/colors/useColors";

type ValueType = {
  email: string;
  password: string;
};

const Login = () => {
  // Hooks
  const Colors = useColor();

  // State
  const [loading, setLoading] = useState<boolean>(false);

  // Auth Flow
  const AuthFlow = (values: ValueType) => {
    console.log(values);
  };

  return (
    <View className="flex-1 justify-between bg-background-light dark:bg-background-dark p-2">
      {/* Spacer */}
      <View />
      {/* Image */}
      <View
        style={{
          flexDirection: "row",
          padding: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Feather name="key" size={100} color={Colors.PRIMARY} />
      </View>
      {/* Header */}
      {/* School Select */}
      {/* Email Input - get slug and check domain in email */}
      {/* Password Input */}
      {/* Login Button */}
      {/* Signup Button */}
      <Text className="text-text-light dark:text-text-dark">Login</Text>
    </View>
  );
};

export default Login;
