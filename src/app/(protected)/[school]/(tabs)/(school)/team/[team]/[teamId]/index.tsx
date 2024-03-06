import Loading from "@/components/ui/Loading";
import { useGetTeam } from "@/hooks/team/useTeam";
import { Stack, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

type IndexProps = {};

const Index = ({}: IndexProps) => {
  const { school, team, leagueId, teamId } = useLocalSearchParams<{
    school: string;
    team: string;
    teamId: string;
    leagueId: string;
  }>();

  console.log("ID: ", leagueId);

  const {
    data: teamData,
    isLoading,
    isError,
    error,
  } = useGetTeam(leagueId as string, teamId as string);

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
        <Text className="text-red-500">{error.message}</Text>
      </View>
    );
  }

  console.log("Team Data: ", teamData);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: team,
          headerBackTitleVisible: false,
        }}
      />
      <View className="flex flex-1 items-start justify-start bg-background-light dark:bg-background-dark p-2">
        <Text className="text-text-light dark:text-text-dark">Index</Text>
      </View>
    </>
  );
};

export default Index;
