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

  console.log("Team Data: ", teamData);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: team,
          headerBackTitleVisible: false,
        }}
      />

      <Tab selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

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

const Tab = ({
  selectedTab,
  setSelectedTab,
}: {
  selectedTab: string;
  setSelectedTab: (value: string) => void;
}) => {
  return (
    <View
      className="w-full justify-start gap-4 bg-primary-light dark:bg-primary-dark p-2"
      style={styles.container}
    >
      {tabList.map((tab) => {
        const isActive = tab.value === selectedTab;
        return (
          <Pressable
            key={tab.value}
            onPress={() => setSelectedTab(tab.value)}
            style={[
              styles.tab,
              isActive ? styles.activeTab : styles.inactiveTab,
            ]}
          >
            <Text
              style={isActive ? styles.activeTabText : styles.inactiveTabText}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    shadowOpacity: 0.1,
    shadowColor: "black",
    shadowOffset: { height: 0, width: 0 },
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  activeTab: {
    backgroundColor: "white",
  },
  inactiveTab: {},
  activeTabText: {
    color: "black",
    fontWeight: "bold",
  },
  inactiveTabText: {
    color: "grey",
  },
});
