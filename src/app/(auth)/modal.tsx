import { Text, View } from "react-native";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useGetSchoolList } from "@/hooks/authentication/useAuthentication";
import Loading from "@/components/ui/Loading";
import { formatSchoolList } from "./reuseables";
import Picker from "@/components/picker/Picker";

type ModalProps = {};

// Navigation Map
const navigationMap: { [key: string]: string } = {
  login: "/login",
  register: "/create/sign-up-1",
  forgot: "/actions/forgot",
  verify: "/actions/verify",
  reset: "/actions/reset",
};

const Modal = ({}: ModalProps) => {
  const isPresented = router.canGoBack();

  // Incoming Data
  const { incoming } = useLocalSearchParams<{
    incoming: string;
  }>();

  const { data: rawSchoolList, isLoading, isError, error } = useGetSchoolList();

  // Function to go back
  const goBack = (schoolName: string, domain: string) => {
    const route = navigationMap[incoming ?? "login"];

    // Data to send back
    const data = {
      school: schoolName,
      domain,
    };

    // Data String
    const dataString = JSON.stringify(data);

    // Go back to the previous route
    if (isPresented) {
      router.navigate({
        pathname: route,
        params: {
          data: dataString,
        },
      });
    } else {
      console.log("Modal not Dismissed");
      throw new Error("Modal not Dismissed");
    }
  };

  if (isLoading)
    return (
      <View className="bg-background-light dark:bg-background-dark flex-1 items-center justify-center">
        <Loading />
      </View>
    );

  if (isError) {
    console.log("Error @School Picker Modal: ", error);
    return (
      <View className="bg-background-light dark:bg-background-dark flex-1 items-center justify-center">
        <Text className="text-text-light dark:text-text-dark">
          {error.message}
        </Text>
      </View>
    );
  }

  const schoolList = formatSchoolList(rawSchoolList);

  if (rawSchoolList) {
    return (
      <View className="flex flex-1 items-start justify-between bg-background-light dark:bg-background-dark p-2">
        <Picker
          items={schoolList}
          onValueChange={(schoolName: string, domain: string) => {
            goBack(schoolName, domain);
          }}
          message="Select your School"
          searchItem="school"
          close={() => router.back()}
        />
      </View>
    );
  }

  return null;
};

export default Modal;
