import { Stack } from "expo-router";
import { SafeAreaView } from "react-native";

const Modal = ({ children }: { children: any }) => {
  return (
    <SafeAreaView className="flex flex-1 bg-background-light dark:bg-background-dark justify-center items-center w-full h-full">
      {children}
    </SafeAreaView>
  );
};

export default Modal;
