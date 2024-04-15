import useColor from "@/lib/colors/useColors";
import { validateSignUp } from "@/lib/forms/useValidation";
import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import AuthInput from "../components/AuthInput";
import Loading from "@/components/ui/Loading";
import { AuthButton } from "../components/AuthButton";

type SignUpProps = {};

type ValueType = {
  school: Item;
  email: string;
  name: string;
};

type Item = {
  label: string;
  value: string;
};

const items = Array.from({ length: 50 }, (_, index) => ({
  label: `School ${index + 1}`,
  value: `school${index + 1}.edu`,
}));

const defaultValues: ValueType = {
  school: {
    label: "Select School",
    value: "",
  },
  email: "",
  name: "",
};

type PickerData = {
  domain: string;
  school: string;
};

const SignUp = ({}: SignUpProps) => {
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

  console.log("Picker Data: ", pickerData);

  const [loading, setLoading] = useState<boolean>(false);

  const { domain, school } = pickerData;

  const { signUpSchema1Zod } = validateSignUp(domain ?? "");

  // Auth Flow
  const AuthFlow = (values: ValueType) => {
    setLoading(true);

    const { name, email, school } = values;
    const data = {
      name,
      email,
      school_value: pickerData.domain,
      school_label: pickerData.school,
    };

    console.log("Data: ", data);

    try {
      push({ pathname: "/create/sign-up-2", params: data });
    } catch (err: any) {
      console.log("Error @SignUp.AuthFlow: ", err.message);
      alert(err.message);
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
    resolver: zodResolver(signUpSchema1Zod),
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
            Hello there!
          </Text>
          <Text className="text-text-light dark:text-text-dark text-xl text-center font-light">
            Let's get you signed up.
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
                  params: { incoming: "register" },
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
              {/* Name */}
              <AuthInput
                config={{
                  placeholder: "Full Name",
                  textContentType: "name",
                }}
                control={control}
                name="name"
              />

              {/* Spacer */}
              <View style={{ height: 10 }} />

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

              {/* Login Button */}
              <View>
                {/* Submit */}
                {loading && <Loading />}
                {!loading && (
                  <AuthButton
                    onPress={handleSubmit(AuthFlow)}
                    label="Next"
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
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => replace("/create/sign-up-1")}>
              <Text className="text-primary-light dark:text-primary-dark text-xl font-bold">
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SignUp;
