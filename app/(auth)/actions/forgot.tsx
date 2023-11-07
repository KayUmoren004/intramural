import { View, Text } from "react-native";

const ForgotPassword = () => {
  return (
    <View className="flex flex-col items-start p-5 bg-background-light dark:bg-background-dark">
      <Text className="text-text-light dark:text-text-dark text-3xl font-bold text-center">
        Forgot Password
      </Text>
    </View>
  );
};

export default ForgotPassword;
