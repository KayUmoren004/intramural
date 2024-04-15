import { View, Text } from "react-native";

export const Header = ({
  title,
  elevated,
}: {
  title: string;
  elevated?: boolean;
}) => {
  return (
    <View
      style={[
        elevated && {
          shadowOpacity: 0.1,
          shadowColor: "black",
          shadowOffset: { height: 0, width: 0 },
        },
      ]}
      className="items-center justify-center w-full bg-primary dark:bg-primary-dark h-14"
    >
      <Text className="text-2xl font-bold text-text dark:text-text-dark p-4">
        {title}
      </Text>
    </View>
  );
};
