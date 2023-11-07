import { Feather, Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import useColor from "../../../src/lib/colors/useColors";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  appResetPassword,
  appVerifyEmail,
  getCurrentUser,
} from "../../../store";
import { AuthButton } from "../../../src/components/auth/AuthButton";

const VerifyAccount = () => {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const Colors = useColor();

  // States
  const [res, setRes] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);
  const [buttonPressed, setButtonPressed] = useState<boolean>(false);

  // Set Button Pressed to false every 60 seconds
  useEffect(() => {
    if (buttonPressed) {
      const interval = setInterval(() => {
        setButtonPressed(false);
      }, 120000);
      return () => clearInterval(interval);
    }
  }, []);

  // Verify Email
  const verify = async () => {
    try {
      const emailSent = await appVerifyEmail();

      if (emailSent.success) {
        setRes(true);
        setSent(true);

        // Constantly check if the user has verified their email
        const interval = setInterval(async () => {
          const user = await getCurrentUser();

          if (user.user) {
            if (user.user.emailVerified) {
              clearInterval(interval);
              router.replace(`/(protected)/${slug}/dashboard`);
            }
          } else {
            console.log("Error @Reset-Password.AuthFlow: ", user.error.message);
          }
        }, 1000);
      } else {
        Alert.alert("Error", emailSent.error.message, [
          {
            text: "OK",
          },
        ]);
      }
    } catch (error: any) {
      console.log("Error @Reset-Password.AuthFlow: ", error.message);
    }
  };

  return (
    <View className="flex-1 justify-between items-center bg-background-light dark:bg-background-dark">
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
            <Feather name="key" size={50} color={Colors.TEXT} />
          </View>
          <View>
            <Feather name="key" size={50} style={{ opacity: 0 }} />
          </View>
        </View>
      </View>

      {/* Body */}
      <View>
        <View className="flex flex-col items-center p-5">
          <Text className="text-text-light dark:text-text-dark text-3xl font-bold text-center">
            Verify Email
          </Text>
          <Text className="text-text-light dark:text-text-dark text-xl text-center font-light">
            Please verify your email to continue.
          </Text>
        </View>

        <View className="flex flex-col items-center justify-center p-5">
          <Text className="text-text-light dark:text-text-dark text-xl text-center font-light">
            We have sent you an email with a link to verify your email.
          </Text>
        </View>

        <View className="flex flex-col items-center justify-center p-5">
          {sent ? (
            res ? (
              <Text className="text-success-light dark:text-success-dark text-xl text-center font-light">
                Verification Email Successfully Sent!
              </Text>
            ) : (
              <>
                <ActivityIndicator size="large" color={Colors.PRIMARY} />
                <Text className="text-information-light dark:text-information-dark text-xl text-center font-light">
                  Sending...
                </Text>
              </>
            )
          ) : null}
        </View>

        <View className="p-2 mb-7">
          <AuthButton
            label="Send Email"
            onPress={() => verify()}
            destructive={false}
            disabled={buttonPressed}
          />
        </View>
      </View>
    </View>
  );
};

export default VerifyAccount;
