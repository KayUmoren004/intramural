import CustomTable from "@/components/custom-table/table";
import Fixture, {
  FixtureType,
} from "@/components/games/fixtures/fixture-items";
import CreateTeam from "@/components/school/create-team";
import Table from "@/components/table";
import Loading from "@/components/ui/Loading";
import { useGetLeague } from "@/hooks/league/useLeague";
import useColor from "@/lib/colors/useColors";
import { useSession } from "@/lib/providers/auth-provider";
import { League, Team } from "@/lib/types/entities";
import { sportHeaders, sporttable } from "@/lib/types/headers";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View, Modal, ScrollView } from "react-native";
import { DataTable } from "react-native-paper";

type IndexProps = {};

const DefaultImageMap: { [key: string]: string } = {
  home: "./home.png",
  away: "./away.png",
};

const fixture: FixtureType = {
  homeTeam: {
    logo: "",
    name: "Home Team",
    teamId: "1",
    type: "home",
  },
  awayTeam: {
    logo: "",
    name: "Away Team",
    teamId: "2",
    type: "away",
  },
  date: "2022-01-01",
  time: "12:00 PM",
};

const Index = ({}: IndexProps) => {
  const { school, league, leagueId, sportId } = useLocalSearchParams<{
    school: string;
    league: string;
    leagueId: string;
    sportId: string;
  }>();

  const { session } = useSession();
  const { replace, push } = useRouter();
  const colors = useColor();
  const [modalOpen, setModalOpen] = useState(false);

  const {
    data: leagueData,
    isLoading,
    isError,
    error,
  } = useGetLeague(sportId as string, leagueId as string);

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

  const { teams } = leagueData as League;

  const sportName = leagueData?.sport?.name ?? "";

  const sportNameInCamelCase = sportName
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");

  const header = sportHeaders[sportNameInCamelCase];

  const table: sporttable = {
    headers: header,
    teams: FakeData.slice(0, 3),
  };

  // Find team by captainId
  const team = {
    position: 1,
    Team: "FC Awesome",
    stats: {
      GP: 10,
      W: 6,
      T: 2,
      L: 2,
      // "+/-": "20-10",
      GD: 10,
      PTS: 20,
    },
    Form: "W-L-W-W-T",
  };
  // const team = teams.find((team) => team.captainId === session?.user?.id);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: league,
        }}
      />
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          alignItems: "flex-start",
          // justifyContent: "space-between",
          gap: 8,
          width: "100%",
          padding: 8,
        }}
        style={{ flex: 1 }}
        className=" bg-background-light dark:bg-background-dark"
      >
        <View className="w-full gap-2">
          {/* TODO: Limit to 3 fixtures in the current week */}
          <View className="flex flex-row items-center justify-between w-full border-b border-neutral-400 pb-2">
            <Text className="text-text-light dark:text-text-dark text-2xl">
              Upcoming Fixtures
            </Text>
          </View>
          <Fixture {...fixture} />
          <Fixture {...fixture} />
          <Fixture {...fixture} />
        </View>

        <View className="w-full my-8">
          <View className="flex flex-row items-center justify-between w-full border-b border-neutral-400 pb-2">
            <Text className="text-text-light dark:text-text-dark text-2xl">
              Standings
            </Text>
          </View>
          <DataTable.Row>
            <DataTable.Cell>
              <Text className="text-white dark:text-text-dark">
                {team.position}
              </Text>
            </DataTable.Cell>
            <View className="w-1/2">
              <DataTable.Cell>
                <Text className="text-white dark:text-text-dark">
                  {team.Team}
                </Text>
              </DataTable.Cell>
            </View>
            {Object.values(team.stats).map((stat: any, idx: number) => {
              console.log(stat);
              if (stat !== team.stats.PTS)
                return (
                  <DataTable.Cell key={idx}>
                    <Text className="text-white dark:text-text-dark"> </Text>
                  </DataTable.Cell>
                );
              return (
                <DataTable.Cell key={idx}>
                  <View className="w-full">
                    <Text className="text-white dark:text-text-dark ">
                      {stat} pts
                    </Text>
                  </View>
                </DataTable.Cell>
              );
            })}
          </DataTable.Row>
        </View>

        {/* List of Teams in the league */}
        <View className="flex flex-col items-start w-full ">
          <View className="flex flex-row items-center justify-between w-full border-b border-neutral-400 pb-2">
            <Text className="text-text-light dark:text-text-dark text-2xl">
              Teams
            </Text>
            <TouchableOpacity
              className="p-1 border border-primary rounded-lg "
              onPress={() => setModalOpen(!modalOpen)}
            >
              {/* <Feather name="plus" size={20} color={colors.PRIMARY} /> */}
              <Text className="text-primary">Create Team</Text>
            </TouchableOpacity>
          </View>
          <View className="w-full h-full mt-4">
            <FlashList
              data={teams}
              keyExtractor={(item) => item.id}
              estimatedItemSize={50}
              renderItem={({ item }) => <LeagueTeams team={item} />}
              scrollEnabled={false}
            />
          </View>
        </View>
      </ScrollView>
      <Modal
        visible={modalOpen}
        onRequestClose={() => {
          setModalOpen(!modalOpen);
        }}
        animationType="slide"
        className=" bg-background dark:bg-background-dark items-start justify-between w-full"
      >
        <CreateTeam
          captainId={session?.user?.id}
          leagueId={leagueId}
          setModalOpen={setModalOpen}
        />
      </Modal>
    </>
  );
};

const LeagueTeams = ({ team }: { team: Team }) => {
  const name = team?.name ?? "Team Unkown";
  const captainName = team?.captain?.name;
  const id = team?.id ?? "0";
  const logoUrl = team?.logoUrl ?? DefaultImageMap.home;
  const leagueId = team?.leagueId;

  const { push } = useRouter();
  const { school } = useLocalSearchParams<{ school: string }>();

  return (
    <TouchableOpacity
      onPress={() =>
        push({
          pathname: `/${school}/(tabs)/(school)/team/${name}/${id}`,
          params: {
            leagueId: leagueId,
          },
        })
      }
      className="w-full py-4 px-2 border-b border-red-500 rounded"
    >
      <View className="flex flex-row items-center justify-between w-full gap-2">
        <View className="flex flex-row items-center justify-start gap-2">
          <MaterialIcons name="sports-soccer" size={24} color="white" />
          <Text key={team.id} className="text-text-light dark:text-text-dark">
            {name}
          </Text>
        </View>

        <View>
          <Text className="text-text-light dark:text-text-dark">
            {captainName.length > 0 ? `${captainName}` : ""}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Index;

const FakeData = [
  {
    position: 1,
    Team: "FC Awesome",
    stats: {
      GP: 10,
      W: 6,
      T: 2,
      L: 2,
      // "+/-": "20-10",
      GD: 10,
      PTS: 20,
    },
    Form: "W-L-W-W-T",
  },
  {
    position: 2,
    Team: "Eagles United",
    stats: {
      GP: 10,
      W: 5,
      T: 3,
      L: 2,
      // "+/-": "10-5",
      GD: 5,
      PTS: 18,
    },
    Form: "W-T-L-W-T",
  },
  {
    position: 3,
    Team: "River City",
    stats: {
      GP: 10,
      W: 3,
      T: 4,
      L: 3,
      // "+/-": "1-3",
      GD: -1,
      PTS: 13,
    },
    Form: "T-T-W-L-T",
  },
  {
    position: 4,
    Team: "Mountain Rovers",
    stats: {
      GP: 10,
      W: 2,
      T: 5,
      L: 3,
      // "+/-": "10-10",
      GD: 0,
      PTS: 11,
    },
    Form: "T-T-T-W-L",
  },
  {
    position: 5,
    Team: "Seaside FC",
    stats: {
      GP: 10,
      W: 1,
      T: 6,
      L: 3,
      // "+/-": "2-5",
      GD: -3,
      PTS: 9,
    },

    Form: "L-T-T-T-T",
  },
];
