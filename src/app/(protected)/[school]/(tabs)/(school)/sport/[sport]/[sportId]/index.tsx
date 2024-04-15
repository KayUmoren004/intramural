import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useLayoutEffect, useState } from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";
import { Stack } from "expo-router";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useSession } from "@/lib/providers/auth-provider";
import { useGetSport } from "@/hooks/sport/useSport";
import Loading from "@/components/ui/Loading";
import { FlashList } from "@shopify/flash-list";
import LeaguesList from "@/components/school/leagues-list";
import { Divider } from "@rneui/themed";
import useColor from "@/lib/colors/useColors";
import { Icon } from "react-native-vector-icons/Icon";

type IndexProps = {};

const SportIconMap: { [key: string]: any } = {
  soccer: <MaterialIcons name="sports-soccer" size={24} color="black" />,
  basketball: (
    <MaterialIcons name="sports-basketball" size={24} color="black" />
  ),
  volleyball: (
    <MaterialIcons name="sports-volleyball" size={24} color="black" />
  ),
  baseball: <MaterialIcons name="sports-baseball" size={24} color="black" />,
  tennis: <MaterialIcons name="sports-tennis" size={24} color="black" />,
  golf: <MaterialIcons name="sports-golf" size={24} color="black" />,
  football: <MaterialIcons name="sports-football" size={24} color="black" />,
};

const Index = ({}: IndexProps) => {
  const { school, sportId, sport } = useLocalSearchParams<{
    school: string;
    sport: string;
    sportId: string;
  }>();

  const { session } = useSession();
  const { replace } = useRouter();
  const colors = useColor();

  const schoolId = session?.user?.schoolId ?? "";

  const {
    data: sportData,
    isLoading,
    isError,
    error,
  } = useGetSport(schoolId, sportId ?? "");

  if (isLoading)
    return (
      <View className="bg-background-light dark:bg-background-dark flex-1 items-center justify-center">
        <Loading />
      </View>
    );

  if (isError) {
    console.log("Error @Sport: ", error);
    return (
      <View className="bg-background-light dark:bg-background-dark flex-1 items-center justify-center">
        <Text className="text-red-500">{error.message}</Text>
      </View>
    );
  }

  const leagues = sportData?.leagues;

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: sport,
          headerLeft: () => (
            <TouchableOpacity onPress={() => replace(`/${school}/school`)}>
              <Feather name="arrow-left" size={25} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      <View className="flex flex-1 items-start justify bg-background-light dark:bg-background-dark p-2">
        {/* Header */}
        <Text className="text-text-light dark:text-text-dark text-3xl font-bold uppercase text-justify">
          Leagues
        </Text>

        {/* Body */}
        <View className="flex flex-col items-start p-2 w-full">
          <View className="w-full h-full">
            <FlashList
              data={leagues}
              keyExtractor={(item) => item.id}
              estimatedItemSize={50}
              renderItem={({ item, index }) => <LeaguesList league={item} />}
            />
          </View>
        </View>
      </View>
    </>
  );
};

export default Index;
