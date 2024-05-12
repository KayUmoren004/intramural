import Loading from "@/components/ui/Loading";
import { useGetSchoolList } from "@/hooks/authentication/useAuthentication";
import useColor from "@/lib/colors/useColors";
import { validateLogin } from "@/lib/forms/useValidation";
import { useSession } from "@/lib/providers/auth-provider";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { yupResolver } from "@hookform/resolvers/yup";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthInput from "./components/AuthInput";
import { AuthButton } from "./components/AuthButton";

type LoginProps = {};

type ValueType = {
  email: string;
  password: string;
};

const defaultValues: ValueType = {
  email: "",
  password: "",
};

type PickerData = {
  domain: string;
  school: string;
};

const Login = ({}: LoginProps) => {
  // Hooks
  const colors = useColor();

  // Router
  const { push, replace } = useRouter();
  const { data } = useLocalSearchParams<{
    data: string;
  }>();

  const pickerData: PickerData = useMemo(() => {
    const parsedData = data ? JSON.parse(data) : null;
    return parsedData ?? {};
  }, [data]);
  const [loading, setLoading] = useState<boolean>(false);

  const { domain, school } = pickerData;

  const { LoginZod } = validateLogin(domain ?? "");

  // Session
  const { signIn } = useSession();

  // Auth Flow
  const AuthFlow = async (values: ValueType) => {
    const { email, password } = values;

    setLoading(true);

    try {
      signIn(email, password);
    } catch (error: any) {
      // Alert.alert("Error", error.message);
      console.log("Error @Login.AuthFlow: ", error);
      // Alert.alert("Login Error", JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  };

  // Form
  const {
    control,
    setFocus,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm({
    defaultValues,
    resolver: zodResolver(LoginZod),
    mode: "onSubmit",
  });

  return (
    <View className="bg-background-light dark:bg-background-dark flex-1 justify-between">
      {/* Spacer */}
      <View />
      {/* Image */}
      <View className="flex flex-row items-center justify-center p-2">
        <Feather name="key" size={100} color={colors.PRIMARY} />
      </View>

      <View>
        {/* Header */}
        <View className="flex flex-col items-start p-5">
          <Text className="text-text-light dark:text-text-dark text-center text-3xl font-bold">
            Welcome Back!
          </Text>
          <Text className="text-text-light dark:text-text-dark text-center text-xl font-light">
            {school !== undefined && domain !== undefined
              ? "Enter your credentials to continue"
              : "Select your school to continue"}
          </Text>
        </View>

        {/* Form */}
        <View className="p-5">
          {/* Modal */}
          <View>
            <TouchableOpacity
              onPress={() =>
                push({
                  pathname: "/modal",
                  params: { incoming: "login" },
                })
              }
              className="flex flex-row items-center justify-center p-2"
            >
              <Text className="text-primary-light dark:text-primary-dark text-center text-xl font-bold ">
                {school && domain ? school : "Select your school"}
              </Text>
            </TouchableOpacity>
          </View>

          {school !== undefined && domain !== undefined ? (
            <>
              {/* Email */}
              <AuthInput
                config={{
                  placeholder: "Email",
                  textContentType: "emailAddress",
                  keyboardType: "email-address",
                }}
                control={control}
                name="email"
              />

              {/* Spacer */}
              <View style={{ height: 10 }} />

              {/* Password Input */}
              <AuthInput
                config={{
                  placeholder: "Password",
                  textContentType: "password",
                  keyboardType: "default",
                  secureTextEntry: true,
                }}
                control={control}
                name="password"
              />

              {/* Spacer */}
              <View style={{ height: 10 }} />

              {/* Login Button */}
              <View>
                {/* Submit */}
                {loading && <Loading />}
                {!loading && (
                  <AuthButton
                    onPress={handleSubmit(AuthFlow)}
                    label="Login"
                    disabled={
                      !(isDirty && isValid) &&
                      (school !== undefined || domain !== undefined)
                    }
                  />
                )}
              </View>
            </>
          ) : null}
          {/* Footer */}
          <View className="flex w-full flex-row justify-center p-4">
            <Text className="text-text-light dark:text-text-dark text-xl ">
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => replace("/create/sign-up-1")}>
              <Text className="text-primary-light dark:text-primary-dark text-xl font-bold">
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Login;
