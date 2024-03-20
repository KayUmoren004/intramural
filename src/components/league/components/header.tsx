import { View, Text } from "react-native";

export const Header = ({ title }: { title: string }) => {
  return (
    <View className="items-center justify-center w-full bg-primary dark:bg-primary-dark h-14">
      <Text className="text-2xl font-bold text-text dark:text-text-dark p-4">
        {title}
      </Text>
    </View>
  );
};
