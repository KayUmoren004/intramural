import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import useColor from "../../../src/lib/colors/useColors";
import { validateLogin } from "../../../src/lib/forms/useValidation";
import { Formik } from "formik";
import { Input } from "@rneui/themed";
import Loading from "../../../src/components/ui/Loading";
import { AuthButton } from "../../../src/components/auth/AuthButton";
import { appResetPassword } from "../../../store";

const ForgotPassword = () => {
  // State
  const [loading, setLoading] = useState<boolean>(false);

  // Auth Flow
  const AuthFlow = async (values: { email: string }) => {
    setLoading(true);

    const { email } = values;

    try {
      const sent = await appResetPassword(email);
      if (sent.success) {
        Alert.alert("Password reset email sent!", "Please check your email.", [
          {
            text: "OK",
            onPress: () => router.replace("/login"),
          },
        ]);
      } else {
        Alert.alert("Error", sent.error.message, [
          {
            text: "OK",
          },
        ]);
      }
    } catch (err: any) {
      console.log("Error @Forgot.AuthFlow: ", err.message);
      // alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const { ForgotSchema } = validateLogin("");

  const Colors = useColor();
  return (
    <View className="flex-1 justify-between bg-background-light dark:bg-background-dark">
      {/* Top */}
      <View className="flex flex-row justify-center items-center w-full p-2">
        <View className="flex flex-row justify-between items-center w-full">
          <TouchableOpacity className="" onPress={() => router.back()}>
            <View className="flex flex-row border-2 border-primary-light dark:border-primary-dark rounded-md w-12 h-12 items-center justify-center">
              <Ionicons
                name="chevron-back"
                size={40}
                style={{
                  color: Colors.PRIMARY,
                }}
              />
            </View>
          </TouchableOpacity>
          <View>
            <Feather name="unlock" size={50} color={Colors.TEXT} />
          </View>
          <View>
            <Feather name="unlock" size={50} style={{ opacity: 0 }} />
          </View>
        </View>
      </View>

      {/* Body */}
      <View>
        {/* Header */}
        <View className="flex flex-col items-start p-5">
          <Text className="text-text-light dark:text-text-dark text-3xl font-bold text-center">
            Forgot Password?
          </Text>
          <Text className="text-text-light dark:text-text-dark text-xl text-center font-light">
            Enter your email to reset your password.
          </Text>
        </View>

        {/* Form */}
        <View className="p-5">
          <Formik
            initialValues={{ email: "" }}
            validationSchema={ForgotSchema}
            onSubmit={(values) => AuthFlow(values)}
          >
            {(props) => {
              const emailError =
                String(props.errors.email) === "undefined"
                  ? ""
                  : String(props.errors.email);
              return (
                <View>
                  <Input
                    placeholder="Enter your email"
                    onChangeText={props.handleChange("email")}
                    value={props.values.email}
                    onSubmitEditing={(e: any) => props.handleSubmit}
                    textContentType="none"
                    errorMessage={emailError}
                    inputStyle={{
                      color: Colors.TEXT,
                      fontSize: 17,
                    }}
                    inputContainerStyle={{
                      borderBottomColor: Colors.TEXT,
                      borderBottomWidth: 1,
                    }}
                    leftIcon={{
                      type: "feather",
                      name: "at-sign",
                      color: Colors.PRIMARY,
                    }}
                    inputMode="email"
                    autoCapitalize="none"
                  />

                  {/* Spacer */}
                  <View style={{ height: 10 }} />

                  <View>
                    {/* Submit */}
                    {loading && <Loading />}
                    {!loading && (
                      <AuthButton
                        onPress={props.handleSubmit}
                        label="Reset Password"
                        disabled={!(props.isValid && props.dirty)}
                      />
                    )}
                  </View>
                </View>
              );
            }}
          </Formik>
        </View>
      </View>
    </View>
  );
};

export default ForgotPassword;
