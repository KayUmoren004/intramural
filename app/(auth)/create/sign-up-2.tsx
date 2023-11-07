import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { AuthStore, appSignIn, appSignUp } from "../../../store";
import { Stack, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import useColor from "../../../src/lib/colors/useColors";
import Picker from "../../../src/components/ui/picker/Picker";
import {
  Formik,
  FormikHelpers,
  FormikProps,
  Form,
  Field,
  FieldProps,
  ErrorMessage,
} from "formik";
import { Input } from "@rneui/themed";
import { ErrorMessages } from "../../../src/components/ui/Errors";
import { AuthButton } from "../../../src/components/auth/AuthButton";
import Loading from "../../../src/components/ui/Loading";
import { validateSignUp } from "../../../src/lib/forms/useValidation";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { User } from "../../../src/lib/types/entities";

type ValueType = {
  password: string;
  confirmPassword: string;
};

type Item = {
  label: string;
  value: string;
};

const items = Array.from({ length: 50 }, (_, index) => ({
  label: `School ${index + 1}`,
  value: `school${index + 1}.edu`,
}));

const SignUp = () => {
  // Params
  const data = useLocalSearchParams<{
    name: string;
    email: string;
    school_value: string;
    school_label: string;
  }>();
  console.log("data: ", data);
  // Hooks
  const Colors = useColor();

  // Validation
  const [school, setSchool] = useState<Item>({ label: "", value: "" });
  const { signUpSchema2 } = validateSignUp(school?.value ?? "");

  // State
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(true);
  const [rightIcon, setRightIcon] = useState<string>("eye");
  const [profilePhoto, setProfilePhoto] = useState<
    boolean | string | undefined
  >(false);

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

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1.0,
      });

      if (!result.canceled) {
        // console.log("result: ", result);
        // console.log("Set Photo Input: ", result.assets[0].uri);
        setProfilePhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Error @pickImage: ", error);
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
        const fullUser = {
          name: data.name,
          email: data.email,
          password: actualPassword,
          profilePhoto: profilePhoto,
          schoolDomain: data.school_value,
          role: "CLIENT",
        };

        // router.push({ pathname: "/create/sign-up-2", params: values });

        const res = await appSignUp(fullUser);
        console.log("res: ", res);

        const slug: string = data.school_value.split(".")[0] ?? "";

        if (res?.user) {
          router.replace(`/(protected)/${slug}/dashboard`);
        } else {
          console.log("Error @Login.AuthFlow: ", res);
          Alert.alert("Login Error", res.error?.message);
        }
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

  return (
    <View className="flex-1 justify-between bg-background-light dark:bg-background-dark">
      {/* Top */}
      <View
        style={{
          flexDirection: "row",
          padding: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              marginLeft: 10,
            }}
            onPress={() => router.back()}
          >
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
          <Formik
            initialValues={{
              password: "",
              confirmPassword: "",
            }}
            validationSchema={signUpSchema2}
            onSubmit={(values) => {
              AuthFlow(values);
            }}
          >
            {(props: FormikProps<any>) => {
              const passwordError =
                String(props.errors.password) === "undefined"
                  ? ""
                  : String(props.errors.password);
              const confirmPasswordError =
                String(props.errors.confirmPassword) === "undefined"
                  ? ""
                  : String(props.errors.confirmPassword);
              return (
                <View>
                  {/* Profile Pic */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      width: "100%",
                      borderWidth: 1,
                      borderColor: Colors.PRIMARY,
                      borderRadius: 10,
                      marginBottom: 10,
                    }}
                  >
                    <TouchableOpacity
                      // onPress={() => {
                      //   console.log("Image Picker");
                      // }}
                      onPress={addProfilePhoto}
                      style={{
                        flex: 1,
                        // justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        width: "100%",
                        padding: 10,
                      }}
                    >
                      <View
                        style={{
                          borderRadius: 100,
                          justifyContent: "center",
                          alignItems: "center",
                          borderWidth: 1,
                          borderColor: Colors.PRIMARY,
                          padding: 5,
                        }}
                      >
                        {profilePhoto ? (
                          <Image
                            source={{ uri: String(profilePhoto) }}
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
                          {profilePhoto
                            ? "Profile Photo Added"
                            : "Add Profile Photo"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  {/* Password */}
                  <Input
                    placeholder="Create your password"
                    onChangeText={props.handleChange("password")}
                    value={props.values.password}
                    onSubmitEditing={(e: any) => props.handleSubmit}
                    errorMessage={passwordError}
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
                      name: "lock",
                      color: Colors.PRIMARY,
                    }}
                    autoCapitalize="none"
                    secureTextEntry={true}
                    textContentType="none"
                  />
                  {/* Spacer */}
                  <View style={{ height: 10 }} />

                  {/* Confirm Password */}
                  <Input
                    placeholder="Confirm your password"
                    onChangeText={props.handleChange("confirmPassword")}
                    value={props.values.confirmPassword}
                    onSubmitEditing={(e: any) => props.handleSubmit}
                    errorMessage={confirmPasswordError}
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
                      name: "lock",
                      color: Colors.PRIMARY,
                    }}
                    autoCapitalize="none"
                    secureTextEntry={true}
                    textContentType="none"
                  />

                  {/* Spacer */}
                  <View style={{ height: 10 }} />

                  {/* Login Button */}
                  <View>
                    {/* Submit */}
                    {loading && <Loading />}
                    {!loading && (
                      <AuthButton onPress={props.handleSubmit} label="Submit" />
                    )}
                  </View>
                  {/* Footer */}
                  <View className="flex flex-row justify-center w-full p-4">
                    <Text className="text-text-light dark:text-text-dark text-xl ">
                      Already have an account?{" "}
                    </Text>
                    <TouchableOpacity onPress={() => router.replace("/login")}>
                      <Text className="text-primary-light dark:text-primary-dark text-xl font-bold">
                        Login
                      </Text>
                    </TouchableOpacity>
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

export default SignUp;
