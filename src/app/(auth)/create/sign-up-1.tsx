import { Text, View } from "react-native";

type SignUpProps = {};

const SignUp = ({}: SignUpProps) => {
  return (
    <View className="flex flex-1 items-center justify bg-background-light dark:bg-background-dark">
      <Text className="text-text-light dark:text-text-dark">SignUp 1</Text>
    </View>
  );
};

export default SignUp;
