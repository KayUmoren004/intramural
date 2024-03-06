import { useController } from "react-hook-form";
import { Input } from "@rneui/themed";
import { TextInputProps } from "react-native/Libraries/Components/TextInput/TextInput";
import useColor from "@/lib/colors/useColors";
import { useRouter } from "expo-router";
import { TouchableOpacity, Text } from "react-native";
import { IconNode } from "@rneui/base";

interface AuthInputProps extends TextInputProps {}

const AuthInput = ({
  name,
  control,
  config,
}: {
  name: string;
  control: any;
  config?: AuthInputProps;
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    defaultValue: "",
    name,
  });

  const colors = useColor();
  const { push } = useRouter();

  const leftIconMap: {
    [key: string]: {
      type: string;
      name: string;
      color: string;
    };
  } = {
    email: {
      type: "feather",
      name: "at-sign",
      color: colors.PRIMARY,
    },
    password: {
      type: "feather",
      name: "lock",
      color: colors.PRIMARY,
    },
  };

  const rightIconMap: {
    [key: string]: IconNode;
  } = {
    password: (
      <TouchableOpacity
        onPress={() => {
          push("/(auth)/actions/forgot");
        }}
      >
        <Text className="text-primary-light dark:text-primary-dark text-center text-xl font-bold">
          Forgot?
        </Text>
      </TouchableOpacity>
    ),
  };

  return (
    <Input
      {...config}
      ref={field.ref}
      value={field.value}
      onChangeText={field.onChange}
      errorMessage={error?.message}
      inputStyle={{
        color: colors.TEXT,
        fontSize: 17,
      }}
      inputContainerStyle={{
        borderBottomColor: colors.TEXT,
        borderBottomWidth: 1,
      }}
      autoCapitalize="none"
      leftIcon={leftIconMap[name]}
      rightIcon={rightIconMap[name]}
    />
  );
};

export default AuthInput;
