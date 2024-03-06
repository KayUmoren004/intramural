import { Text, View } from "react-native";

type VerifyProps = {};

const Verify = ({}: VerifyProps) => {
  return (
    <View className="flex flex-1 items-center justify bg-background-light dark:bg-background-dark">
      <Text className="text-text-light dark:text-text-dark">Verify</Text>
    </View>
  );
};

export default Verify;
