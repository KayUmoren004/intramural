import SchoolList from "@/components/school/school-list";
import Loading from "@/components/ui/Loading";
import { useGetLeagues } from "@/hooks/league/useLeague";
import { useGetSports } from "@/hooks/sport/useSport";
import { useSession } from "@/lib/providers/auth-provider";
import { FlashList } from "@shopify/flash-list";
import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Appearance,
  useColorScheme,
  Button,
  SafeAreaView,
} from "react-native";

export default function App() {
  const { school } = useGlobalSearchParams();

  const { session } = useSession();

  const schoolId = session?.user?.schoolId;

  const {
    data: sports,
    isLoading,
    isError,
    error,
  } = useGetSports(schoolId ?? "");

  if (isLoading)
    return (
      <View className="bg-background-light dark:bg-background-dark flex-1 items-center justify-center">
        <Loading />
      </View>
    );

  if (isError) {
    console.log("Error @Login: ", error);
    return (
      <View className="bg-background-light dark:bg-background-dark flex-1 items-center justify-center">
        <Text className="text-text-light dark:text-text-dark">
          {error.message}
        </Text>
      </View>
    );
  }

  // console.log("Sports: ", sports);

  return (
    <SafeAreaView className="flex-1 items-start justify-start bg-background-light dark:bg-background-dark">
      {/* Header */}
      <View className="w-full  px-2 flex-row items-start justify-between border-b border-white/30">
        <Text className="text-text-light dark:text-text-dark text-5xl font-bold uppercase text-justify">
          {school}
        </Text>
        {/* <Text className="text-text-light dark:text-text-dark text-5xl font-bold">
          School
        </Text> */}
      </View>

      {/* Body */}
      <View className="flex flex-col items-start p-2 w-full">
        <View className="w-full h-full">
          <FlashList
            data={sports}
            keyExtractor={(item) => item.id}
            estimatedItemSize={50}
            renderItem={({ item }) => <SchoolList sport={item} />}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
