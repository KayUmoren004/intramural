import { Text, View } from "react-native";

type ForgotProps = {};

const Forgot = ({}: ForgotProps) => {
  return (
    <View className="flex flex-1 items-center justify bg-background-light dark:bg-background-dark">
      <Text className="text-text-light dark:text-text-dark">forgot</Text>
    </View>
  );
};

export default Forgot;
