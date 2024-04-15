import useColor from "@/lib/colors/useColors";
import { validateSignUp } from "@/lib/forms/useValidation";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { Feather, Ionicons } from "@expo/vector-icons";
import AuthInput from "../components/AuthInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Loading from "@/components/ui/Loading";
import { AuthButton } from "../components/AuthButton";
import { useSession } from "@/lib/providers/auth-provider";
import { Register } from "@/hooks/authentication/authentication";
type SignUpProps = {};

type ValueType = {
  password: string;
  confirmPassword: string;
};

type Item = {
  label: string;
  value: string;
};

const defaultValues: ValueType = {
  password: "",
  confirmPassword: "",
};

const SignUp = ({}: SignUpProps) => {
  // Params
  const data = useLocalSearchParams<{
    name: string;
    email: string;
    school_value: string;
    school_label: string;
  }>();

  const { back, push, replace } = useRouter();

  // Hooks
  const Colors = useColor();

  // Validation
  const [school, setSchool] = useState<Item>({ label: "", value: "" });
  const { signUpSchema2Zod } = validateSignUp(school?.value ?? "");

  // State
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(true);
  const [rightIcon, setRightIcon] = useState<string>("eye");
  const [profilePhoto, setProfilePhoto] = useState<any>(false);

  // Visibility
  const handlePasswordVisibility = () => {
    if (rightIcon === "eye") {
      setRightIcon("eye-off");
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === "eye-off") {
      setRightIcon("eye");
      setPasswordVisibility(!passwordVisibility);
    }
  };

  const getPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      return status;
    }
  };

  // Get Camera Permission
  const getCameraPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      return status;
    }
  };

  // Pick Image
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0,
      });

      console.log(result);

      if (!result.canceled && result.assets) {
        setProfilePhoto(result.assets[0]);
      }

      return result.assets ? result.assets[0] : null;
    } catch (error) {
      console.log("Error @Photo Modal: ", error);
    }
  };

  // Capture Image
  const captureImage = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],

        quality: 0,
      });

      console.log(result);

      if (!result.canceled && result.assets) {
        setProfilePhoto(result.assets[0]);
      }

      return result.assets ? result.assets[0] : null;
    } catch (error) {
      console.log("Error @Photo Modal: ", error);
    }
  };

  const addProfilePhoto = async () => {
    const status = await getPermission();

    if (status !== "granted") {
      alert("We need permission to access your camera roll.");

      return;
    }

    pickImage();
  };

  const { signUp } = useSession();

  // Auth Flow
  const AuthFlow = async (values: ValueType) => {
    setLoading(true);

    const { password, confirmPassword } = values;

    const actualPassword = password === confirmPassword ? password : null;

    try {
      // Assume router and other necessary variables and functions (like appSignUp) are properly defined elsewhere.
      if (
        data &&
        typeof data.school_value === "string" &&
        typeof data.name === "string" &&
        typeof data.email === "string"
      ) {
        const fullUser: Register = {
          name: data.name,
          email: data.email,
          password: String(actualPassword),
          profilePhoto: profilePhoto,
          schoolDomain: data.school_value,
          role: "CLIENT",
        };

        await signUp(fullUser);
      } else {
        console.log("data.school_value is undefined");
        // Handle the case when data.school_value is undefined
      }
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
    resolver: zodResolver(signUpSchema2Zod),
    mode: "onSubmit",
  });

  return (
    <View className="flex-1 justify-between bg-background-light dark:bg-background-dark">
      {/* Top */}
      <View className="flex flex-row justify-center items-center w-full p-2">
        <View className="flex flex-row justify-between items-center w-full">
          <TouchableOpacity className="ml-2" onPress={() => back()}>
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
            <Feather name="user-plus" size={50} color={Colors.TEXT} />
          </View>
          <View>
            <Feather name="user-plus" size={50} style={{ opacity: 0 }} />
          </View>
        </View>
      </View>

      <View>
        {/* Header */}
        <View className="flex flex-col items-start p-5">
          <Text className="text-text-light dark:text-text-dark text-3xl font-bold text-center">
            Almost there!
          </Text>
          <Text className="text-text-light dark:text-text-dark text-xl font-light">
            Set up your password and choose an avatar.
          </Text>
        </View>

        {/* Form */}
        <View className="p-5">
          {/* Profile Pic */}
          <View className="flex flex-row mb-4 border border-primary-light dark:border-primary-dark rounded-md w-full items-center justify-center">
            <TouchableOpacity
              onPress={addProfilePhoto}
              className="flex flex-row items-center w-full p-2"
            >
              <View className="rounded-full border border-primary-light dark:border-primary-dark items-center justify-center p-1">
                {profilePhoto ? (
                  <Image
                    source={{ uri: profilePhoto.uri }}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 100,
                    }}
                    contentFit="contain"
                  />
                ) : (
                  <Feather name="user" size={50} color={Colors.TEXT} />
                )}
              </View>
              {/* Text */}
              <View
                style={{
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    color: profilePhoto ? Colors.PRIMARY : Colors.TEXT,
                    fontSize: 17,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {profilePhoto ? "Profile Photo Added" : "Add Profile Photo"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Spacer */}
          <View style={{ height: 10 }} />

          {/* Password */}
          <AuthInput
            config={{
              placeholder: "Password",
              textContentType: "password",
              keyboardType: "default",
            }}
            control={control}
            name="password"
          />

          {/* Spacer */}
          <View style={{ height: 10 }} />

          {/* Confirm Password */}
          <AuthInput
            config={{
              placeholder: "Confirm Password",
              textContentType: "password",
              keyboardType: "default",
            }}
            control={control}
            name="confirmPassword"
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
                disabled={!isDirty && !isValid}
                label="Submit"
              />
            )}
          </View>

          {/* Footer */}
          <View className="flex flex-row justify-center w-full p-4">
            <Text className="text-text-light dark:text-text-dark text-xl ">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => replace("/login")}>
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
