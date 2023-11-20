import { Text, View, Modal, TouchableOpacity, Alert } from "react-native";
import { AuthStore, appSignIn, getSchoolList } from "../../store";
import { Stack, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import useColor from "../../src/lib/colors/useColors";
import { validateLogin } from "../../src/lib/forms/useValidation";
import Picker from "../../src/components/ui/picker/Picker";
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
import { ErrorMessages } from "../../src/components/ui/Errors";
import { AuthButton } from "../../src/components/auth/AuthButton";
import Loading from "../../src/components/ui/Loading";

type ValueType = {
  school: Item;
  email: string;
  password: string;
};

type Item = {
  label: string;
  value: string;
};

const items = Array.from({ length: 50 }, (_, index) => ({
  label: `School ${index + 1}`,
  value: `school${index + 1}.edu`,
}));

const Login = () => {
  // Hooks
  const Colors = useColor();

  console.log("List: ", AuthStore.useState().schoolList);

  // Validation
  const [school, setSchool] = useState<Item>({ label: "", value: "" });
  const { LoginSchema } = validateLogin(school?.value ?? "");

  const [schoolList, setSchoolList] = useState(AuthStore.useState().schoolList);

  // State
  const [loading, setLoading] = useState<boolean>(false);
  const [modalShown, setModalShown] = useState<boolean>(false);

  // Auth Flow
  const AuthFlow = async (values: ValueType) => {
    // console.log(values);
    const { email, password, school } = values;
    const { label, value } = school;

    const slug = value.split(".")[0];

    setLoading(true);

    try {
      const res = await appSignIn(email, password);
      if (res?.user) {
        router.replace(`/(protected)/${slug}/dashboard`);
      } else {
        console.log("Error @Login.AuthFlow: ", res);
        Alert.alert("Login Error", res.error?.message);
      }
    } catch (error) {
      console.log("Error @Login.AuthFlow: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-between bg-background-light dark:bg-background-dark">
      {/* Spacer */}
      <View />
      {/* Image */}
      <View className="flex flex-row justify-center items-center p-2">
        <Feather name="key" size={100} color={Colors.PRIMARY} />
      </View>
      <View>
        {/* Header */}
        <View className="flex flex-col items-start p-5">
          <Text className="text-text-light dark:text-text-dark text-3xl font-bold text-center">
            Welcome Back!
          </Text>
          <Text className="text-text-light dark:text-text-dark text-xl text-center font-light">
            {school.label !== "" && school.value !== ""
              ? "Enter your credentials to continue"
              : "Select your school to continue"}
          </Text>
        </View>

        {/* Form */}
        <View className="p-5">
          <Formik
            initialValues={{
              school: {
                label: "",
                value: "",
              },
              email: "",
              password: "",
            }}
            validationSchema={LoginSchema}
            onSubmit={(values) => {
              AuthFlow(values);
            }}
          >
            {(props: FormikProps<any>) => {
              const emailError =
                String(props.errors.email) === "undefined"
                  ? ""
                  : String(props.errors.email);
              const passwordError =
                String(props.errors.password) === "undefined"
                  ? ""
                  : String(props.errors.password);
              return (
                <View>
                  {/* School Select - Modal */}
                  <View>
                    <Modal visible={modalShown} animationType="slide">
                      <Picker
                        items={schoolList}
                        selectedValue={school?.value ?? ""}
                        onValueChange={(schoolName: string, domain: string) => {
                          setSchool({ label: schoolName, value: domain });
                          props.setFieldValue("school", {
                            label: schoolName,
                            value: domain,
                          });
                          setModalShown(false);
                        }}
                        message="Select your school"
                        searchItem="school"
                        setModalShown={setModalShown}
                        modalShown={modalShown}
                      />
                    </Modal>
                    <TouchableOpacity
                      onPress={() => setModalShown(true)}
                      className="flex flex-row justify-center items-center p-2"
                    >
                      <Text className="text-primary-light dark:text-primary-dark text-xl font-bold text-center ">
                        {school?.label && school?.value
                          ? school?.label
                          : "Select your school"}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {school.value !== "" && school.label !== "" ? (
                    <>
                      {/* Email Input - get slug and check domain in email */}

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
                      {/* Password Input */}

                      <Input
                        placeholder="Enter your password"
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
                        rightIcon={
                          <TouchableOpacity
                            onPress={() =>
                              router.push("/(auth)/actions/forgot")
                            }
                          >
                            <Text className="text-primary-light dark:text-primary-dark text-xl font-bold text-center">
                              Forgot?
                            </Text>
                          </TouchableOpacity>
                        }
                      />

                      {/* Spacer */}
                      <View style={{ height: 10 }} />
                      {/* Login Button */}
                      <View>
                        {/* Submit */}
                        {loading && <Loading />}
                        {!loading && (
                          <AuthButton
                            onPress={props.handleSubmit}
                            label="Login"
                            disabled={
                              !(props.isValid && props.dirty) &&
                              (school.label !== "" || school.value !== "")
                            }
                          />
                        )}
                      </View>
                    </>
                  ) : null}
                  {/* Footer */}
                  <View className="flex flex-row justify-center w-full p-4">
                    <Text className="text-text-light dark:text-text-dark text-xl ">
                      Don't have an account?{" "}
                    </Text>
                    <TouchableOpacity
                      onPress={() => router.replace("/create/sign-up-1")}
                    >
                      <Text className="text-primary-light dark:text-primary-dark text-xl font-bold">
                        Sign up
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

export default Login;
