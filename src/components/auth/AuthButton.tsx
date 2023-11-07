import { Text, TouchableOpacity, View } from "react-native";
import useColor from "../../lib/colors/useColors";

type AuthButtonProps = {
  onPress: () => void;
  label: string;
  destructive?: boolean;
  disabled?: boolean;
};

export const AuthButton = ({
  onPress,
  label,
  destructive,
  disabled,
}: AuthButtonProps) => {
  const backgroundColor = disabled
    ? "bg-disabled dark:bg-disabled-dark"
    : destructive
    ? "bg-error dark:bg-error-dark"
    : "bg-primary dark:bg-primary-dark";
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-full h-14 items-center justify-center rounded-md"
      disabled={disabled}
    >
      <View
        className={`w-full h-14 items-center justify-center rounded-md ${backgroundColor}}`}
      >
        <Text className={`text-text-dark text-lg font-light text-center`}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
