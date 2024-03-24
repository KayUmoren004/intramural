import { Pressable } from "react-native";
import {
  FixtureType,
  FixtureScroll,
  ListFixture,
  ListResult,
  ListTable,
  CreateTeam,
  Loading,
  buildCaptainFixture,
  useGetLeagueFixtures,
  useGetLeague,
  useColor,
  useSession,
  League,
  Stack,
  useLocalSearchParams,
  useRouter,
  MoveRight,
  useState,
  MaterialIcons,
  Text,
  View,
  Modal,
  ScrollView,
  TouchableOpacity,
  FlashList,
  type Team,
} from "./imports";
import { cn } from "@/lib/utils";
import { useRefetchOnFocus } from "@/hooks/useRefectOnFocus";
import { FixturesModal } from "@/components/league/league-fixtures-modal";
import { ResultsModal } from "@/components/league/league-results-modal";
import { TablesModal } from "@/components/league/league-tables-modal";

type IndexProps = {};

// Sort fixtures by date
const sortFixturesByDate = (fixtures: FixtureType[]) => {
  if (!fixtures || fixtures.length < 1) return null;

  return fixtures.sort(
    (a, b) =>
      new Date(a.isoDate ?? a.date).getTime() -
      new Date(b.isoDate ?? b.date).getTime()
  );
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
  const [modalOpen, setModalOpen] = useState(false);

  const { BACKGROUND, PRIMARY, TEXT } = useColor();

  // Modals
  const [fixtureModal, setFixtureModal] = useState(false);
  const [tableModal, setTableModal] = useState(false);
  const [resultModal, setResultModal] = useState(false);

  const {
    data: leagueData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetLeague(sportId as string, leagueId as string);

  const {
    data: fixtureData,
    isLoading: fixtureLoading,
    isError: fixtureIsError,
    error: fixtureError,
    refetch: refetchFixture,
  } = useGetLeagueFixtures(leagueId as string);

  useRefetchOnFocus(refetch, true);
  useRefetchOnFocus(refetchFixture, true);

  if (isLoading || fixtureLoading)
    return (
      <View className="bg-background-light dark:bg-background-dark flex-1 items-center justify-center">
        <Loading />
      </View>
    );

  if (isError) {
    console.log("Error @League - Error: ", error);
    return (
      <View className="bg-background-light dark:bg-background-dark flex-1 items-center justify-center">
        <Text className="text-red-500">{error.message}</Text>
      </View>
    );
  }
  if (fixtureIsError) {
    console.log("Error @@League - Fixture Error: ", error);
    return (
      <View className="bg-background-light dark:bg-background-dark flex-1 items-center justify-center">
        <Text className="text-red-500">{fixtureError.message}</Text>
      </View>
    );
  }

  const { teams } = leagueData as League;
  const { soccerTable } = leagueData as League;

  const fixtures = buildCaptainFixture(
    fixtureData ?? [],
    session?.user?.id ?? ""
  );

  // const fixture = capData?.fixture;
  // const closestFixture = capData?.closestFixture;
  // const previousFixture = capData?.previousFixture;
  // const unsortedFixtures = capData?.unsorted;

  const team =
    teams.find((team) => team.captainId === session?.user?.id) ??
    teams.find((team) =>
      team?.players?.find((player) => player?.userId === session?.user?.id)
    );
  const teamId = team?.id;

  // Find the standings for the current team
  const standings = soccerTable?.find((table) => table.teamId === teamId);

  const sortedFixtures = sortFixturesByDate(fixtures ?? []);

  // Find the index of the fixture that is closest to the current date
  const closestFixtureIndex =
    sortedFixtures &&
    sortedFixtures?.findIndex((fixture) => {
      const fixtureDate = new Date(fixture.isoDate ?? fixture.date);
      const today = new Date();
      return fixtureDate.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0);
    });

  const closestFixture =
    sortedFixtures && closestFixtureIndex !== null
      ? closestFixtureIndex < 0
        ? sortedFixtures[sortedFixtures.length - 1]
        : sortedFixtures[closestFixtureIndex]
      : null;

  // // Find the index of the previous fixture closest to the current date
  const previousFixtureIndex =
    closestFixtureIndex !== null ? closestFixtureIndex - 1 : null;

  const previousFixture =
    sortedFixtures && previousFixtureIndex !== null
      ? previousFixtureIndex < 0
        ? sortedFixtures[0]
        : sortedFixtures[previousFixtureIndex]
      : null;

  const hasTeam = team?.captainId === session?.user?.id;

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: league,
        }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName={cn(
          "bg-background-light dark:bg-background-dark p-2 gap-4"
        )}
      >
        {/* Header */}
        {fixtures && (
          <View className="bg-background-light dark:bg-background-dark py-4  gap-2 border-b border-neutral-400 dark:border-neutral-600">
            <View className="gap-4">
              <Text className="text-text-light dark:text-text-dark text-xl font-bold">
                {team?.shortName ?? team?.name} Matches
              </Text>
              <FixtureScroll fixtures={fixtures} />
            </View>
          </View>
        )}

        <View className="bg-background-light dark:bg-background-dark items-start justify-start w-full px-1 gap-4 b">
          <LeagueCard
            disabled={!closestFixture?.date}
            onPress={() => setFixtureModal(true)}
            header="Fixtures"
          >
            <View className="flex-row justify-between items-center w-full">
              <View>
                <Text className="dark:text-text-light text-text-dark">
                  {closestFixture?.date ?? "No fixture available"}
                </Text>
              </View>
              <View>
                {closestFixture && <ListFixture {...closestFixture} />}
              </View>
            </View>
          </LeagueCard>

          <LeagueCard
            header="Results"
            disabled={!previousFixture?.result}
            onPress={() => setResultModal(true)}
          >
            <View className="flex-row justify-between items-center w-full">
              <View>
                <Text className="dark:text-text-light text-text-dark">
                  {(previousFixture &&
                    previousFixture.result &&
                    previousFixture?.date) ??
                    "No results available"}
                </Text>
              </View>
              <View>
                {previousFixture && previousFixture.result && (
                  <ListResult {...previousFixture} />
                )}
              </View>
            </View>
          </LeagueCard>

          <LeagueCard
            disabled={!standings}
            onPress={() => setTableModal(true)}
            header="Tables"
          >
            {fixtureData && <ListTable data={standings ?? null} />}
          </LeagueCard>
        </View>

        {/* Divider */}
        <View className="w-full h-px " />

        {/* List of Teams in the league */}
        <View className="flex flex-col items-start w-full ">
          <View className="flex flex-row items-center justify-between w-full border-b border-neutral-400 dark:border-neutral-600 pb-2">
            <Text className="text-text-light dark:text-text-dark font-bold text-2xl">
              Teams
            </Text>
            {!hasTeam && (
              <TouchableOpacity
                className="p-1 border border-primary rounded-lg "
                onPress={() => setModalOpen(!modalOpen)}
              >
                <Text className="text-primary">Create Team</Text>
              </TouchableOpacity>
            )}
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
        presentationStyle="formSheet"
      >
        <CreateTeam
          captainId={session?.user?.id}
          leagueId={leagueId}
          setModalOpen={setModalOpen}
        />
      </Modal>
      <FixturesModal
        isOpen={fixtureModal}
        onClose={() => setFixtureModal(false)}
        onChange={(val: any) => console.log(val)}
        title="Fixtures"
        fixtures={fixtureData}
      />
      <ResultsModal
        isOpen={resultModal}
        onClose={() => setResultModal(false)}
        onChange={(val: any) => console.log(val)}
        title="Results"
        results={fixtureData}
      />
      <TablesModal
        isOpen={tableModal}
        onClose={() => setTableModal(false)}
        onChange={(val: any) => console.log(val)}
        title="Tables"
        league={leagueData}
      />
    </>
  );
};

const LeagueCard = ({
  header,
  children,
  onPress,
  disabled,
}: {
  header: string;
  children?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
}) => {
  return (
    <Pressable disabled={disabled} onPress={onPress}>
      <View className="w-full h-24 border border-neutral-300 rounded flex flex-col items-start justify-between bg-black dark:bg-white">
        <View className="w-full flex-row items-center justify-between border-b border-neutral-300 p-2">
          <Text className="dark:text-text-light text-text-dark text-2xl">
            {header}
          </Text>
          <MoveRight />
        </View>
        <View className="w-full p-2 ">
          {children ?? (
            <Text className="dark:text-text-light text-text-dark">
              No {header} available
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const LeagueTeams = ({ team }: { team: Team }) => {
  const name = team?.name ?? "Team Unkown";
  const captainName = team?.captain?.name;
  const id = team?.id ?? "0";
  // const logoUrl = team?.logoUrl ?? DefaultImageMap.home;
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
