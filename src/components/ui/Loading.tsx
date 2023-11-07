import { ActivityIndicator, View } from "react-native";
import useColor from "../../lib/colors/useColors";

// Loading Component
const Loading = () => {
  const Colors = useColor();
  return (
    <View>
      <ActivityIndicator size={"large"} color={Colors.PRIMARY} />
    </View>
  );
};

export default Loading;
