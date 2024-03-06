import { Text, View } from "react-native";

type IndexProps = {};

const Index = ({}: IndexProps) => {
  return (
    <View className="flex flex-1 items-center justify bg-background-light dark:bg-background-dark">
      <Text className="text-text-light dark:text-text-dark">Index</Text>
    </View>
  );
};

export default Index;
