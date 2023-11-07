import { View, Text } from "react-native";

type ErrorMessagesProps = {
  message: string;
};

// Message
export const ErrorMessages = ({ message }: ErrorMessagesProps) => {
  return (
    <View className="">
      <Text className="text-error dark:text-error-dark text-sm font-light">
        {message}
      </Text>
    </View>
  );
};
