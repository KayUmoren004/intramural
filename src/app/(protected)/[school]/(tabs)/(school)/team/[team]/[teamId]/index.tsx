import Loading from "@/components/ui/Loading";
import { useGetTeam } from "@/hooks/team/useTeam";
import { Stack, useLocalSearchParams } from "expo-router";
import { Button, Pressable, Text, View, StyleSheet } from "react-native";
import { MotiView } from "moti";
import {
  Team,
  useColor,
  useState,
} from "../../../league/[league]/[leagueId]/imports";
import { cn } from "@/lib/utils";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { ScheduleTab } from "@/components/team/tabs/schedule-tabs";
import { StatsTab } from "@/components/team/tabs/stats-tabs";
import { RosterTab } from "@/components/team/tabs/roster";
import { useRefetchOnFocus } from "@/hooks/useRefectOnFocus";
import { Tab } from "@/components/ui/tab";

type IndexProps = {};

type TabProp = {
  label: string;
  value: string;
};

const tabList: TabProp[] = [
  {
    label: "Schedule",
    value: "schedule",
  },
  {
    label: "Stats",
    value: "stats",
  },
  {
    label: "Roster",
    value: "roster",
  },
];

const Index = ({}: IndexProps) => {
  const { school, team, leagueId, teamId } = useLocalSearchParams<{
    school: string;
    team: string;
    teamId: string;
    leagueId: string;
  }>();

  // States
  const [selectedTab, setSelectedTab] = useState<string>(tabList[0].value);

  const {
    data: teamData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetTeam(leagueId as string, teamId as string);

  useRefetchOnFocus(refetch, true);

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

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: team,
          headerBackTitleVisible: false,
        }}
      />

      <Tab
        tabList={tabList}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />

      {selectedTab === "schedule" && (
        <ScheduleTab teamId={teamId ?? ""} leagueId={leagueId ?? ""} />
      )}
      {selectedTab === "stats" && <StatsTab />}
      {selectedTab === "roster" && (
        <RosterTab
          roster={teamData?.players}
          captainId={(teamData as Team).captainId}
        />
      )}
    </>
  );
};

export default Index;
