import { Text, View, Modal, TouchableOpacity } from "react-native";
import { AuthStore, appSignIn, getSchoolList } from "../../../store";
import { Stack, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { Feather } from "@expo/vector-icons";
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

const SignUp = () => {
  // Hooks
  const Colors = useColor();

  // Validation
  const [school, setSchool] = useState<Item>({ label: "", value: "" });
  const [schoolList, setSchoolList] = useState([]);
  const { signUpSchema1 } = validateSignUp(school?.value ?? "");

  // State
  const [loading, setLoading] = useState<boolean>(false);
  const [modalShown, setModalShown] = useState<boolean>(false);

  // On Mount, get school lists
  const getSchools = async () => {
    const schools: any = await getSchoolList();
    return schools.schoolList;
  };

  useEffect(() => {
    const s = getSchools();
    s.then((res) => {
      setSchoolList(res);
    });
  }, []);

  // Auth Flow
  const AuthFlow = (values: ValueType) => {
    setLoading(true);

    const { name, email, school } = values;
    const data = {
      name,
      email,
      school_value: school.value,
      school_label: school.label,
    };

    try {
      router.push({ pathname: "/create/sign-up-2", params: data });
    } catch (err: any) {
      console.log("Error @SignUp.AuthFlow: ", err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-between bg-background-light dark:bg-background-dark">
      {/* Spacer */}
      <View />
      {/* Image */}
      <View
        style={{
          flexDirection: "row",
          padding: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Feather name="user-plus" size={100} color={Colors.PRIMARY} />
      </View>
      <View>
        {/* Header */}
        <View className="flex flex-col items-start p-5">
          <Text className="text-text-light dark:text-text-dark text-3xl font-bold text-center">
            Hello there!
          </Text>
          <Text className="text-text-light dark:text-text-dark text-xl text-center font-light">
            Let's get you signed up.
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
              name: "",
            }}
            validationSchema={signUpSchema1}
            onSubmit={(values) => {
              AuthFlow(values);
            }}
          >
            {(props: FormikProps<any>) => {
              const emailError =
                String(props.errors.email) === "undefined"
                  ? ""
                  : String(props.errors.email);
              const nameError =
                String(props.errors.name) === "undefined"
                  ? ""
                  : String(props.errors.name);
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

                  {/* Name */}
                  <Input
                    placeholder="First and Last Name"
                    onChangeText={props.handleChange("name")}
                    value={props.values.name}
                    onSubmitEditing={(e: any) => props.handleSubmit}
                    inputStyle={{
                      color: Colors.TEXT,
                      fontSize: 17,
                    }}
                    inputContainerStyle={{
                      borderBottomColor: Colors.TEXT,
                      borderBottomWidth: 1,
                    }}
                    errorMessage={nameError}
                    leftIcon={{
                      type: "feather",
                      name: "user",
                      color: Colors.PRIMARY,
                    }}
                    autoComplete="name"
                    autoCapitalize="none"
                  />
                  {/* Spacer */}
                  <View style={{ height: 10 }} />

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

                  {/* Login Button */}
                  <View>
                    {/* Submit */}
                    {loading && <Loading />}
                    {!loading && (
                      <AuthButton
                        disabled={school.label === "" || school.value === ""}
                        onPress={props.handleSubmit}
                        label="Next"
                      />
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
