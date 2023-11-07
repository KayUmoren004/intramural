import { Feather } from "@expo/vector-icons";
import { TouchableOpacity, Text, View } from "react-native";
import useColor from "../../../lib/colors/useColors";
import { Divider } from "@rneui/themed";

type PickerItemProps = {
  label: string;
  value: string;
  onPress: () => void;
};

export const PickerItem = ({ label, value, onPress }: PickerItemProps) => {
  const opacity = 0;

  const Colors = useColor();
  return (
    <View className="px-5 py-1 w-full">
      <TouchableOpacity
        className="flex p-2 my-2 flex-row justify-between items-center w-full"
        onPress={onPress}
      >
        <Text className="text-text-light dark:text-text-dark">{label}</Text>
        {/* <Feather name="check" size={24} color={Colors.SECONDARY} /> */}
      </TouchableOpacity>
    </View>
  );
};
