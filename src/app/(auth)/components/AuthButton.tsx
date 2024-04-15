import { cn } from "@/lib/utils";
import { Text, TouchableOpacity, View } from "react-native";

type AuthButtonProps = {
  onPress: () => void;
  label: string;
  destructive?: boolean;
  disabled?: boolean;
  className?: string;
};

const colorMap: { [key: string]: string } = {
  default: "bg-primary dark:bg-primary-dark",
  destructive: "bg-error dark:bg-error-dark",
  disabled: "bg-disabled dark:bg-disabled-dark",
};

export const AuthButton = ({
  onPress,
  label,
  destructive,
  disabled,
  className,
}: AuthButtonProps) => {
  const backgroundColor = disabled
    ? colorMap["disabled"]
    : destructive
    ? colorMap["destructive"]
    : colorMap["default"];

  return (
    <TouchableOpacity
      onPress={onPress}
      className={cn(
        "w-full h-14 items-center justify-center rounded-md",
        className
      )}
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
