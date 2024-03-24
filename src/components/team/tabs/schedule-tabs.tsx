import {
  Fixture,
  FixtureType,
} from "@/components/games/fixtures/fixture-items";
import { Result } from "@/components/games/results/result-items";
import Loading from "@/components/ui/Loading";
import {
  buildFixtures,
  sortFixturesByDate,
} from "@/hooks/fixture/fixture-utils";
import { useGetTeamFixtures } from "@/hooks/fixture/useFixture";
import { useRefetchOnFocus } from "@/hooks/useRefectOnFocus";
import { cn } from "@/lib/utils";
import { SectionList, Text, View } from "react-native";

type ScheduleTabProps = {
  teamId: string;
  leagueId: string;
};

export const ScheduleTab = ({ teamId, leagueId }: ScheduleTabProps) => {
  const {
    data: fixtures,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetTeamFixtures(teamId, leagueId);

  useRefetchOnFocus(refetch, true);

  if (isLoading)
    return (
      <View className="bg-background-light dark:bg-background-dark flex-1 items-center justify-center">
        <Loading />
      </View>
    );

  if (isError) {
    console.log("Error @Schedule Tabs: ", error);
    return (
      <View className="bg-background-light dark:bg-background-dark flex-1 items-center justify-center">
        <Text className="text-red-500">{error.message}</Text>
      </View>
    );
  }

  // Sort Fixtures
  const sortedFixtures = buildFixtures(fixtures ?? []);

  // Sort Fixtures by Date
  const fixtureBins = sortFixturesByDate(sortedFixtures);

  const isLastFixture = (fixture: FixtureType) => {
    const lastFixture = sortedFixtures[sortedFixtures.length - 1];

    return lastFixture.id === fixture.id;
  };

  return (
    // <View className="bg-background-light dark:bg-background-dark flex-1 items-start justify-start p-2">
    //   <Text className="text-text-light dark:text-text-dark">Schedule</Text>
    // </View>
    <View
      className="
      flex flex-1 bg-background-light dark:bg-background-dark w-full"
    >
      {/* <Header title={title} /> */}

      {/* Body */}
      <SectionList
        sections={fixtureBins}
        keyExtractor={(item, index) => item.id + index}
        renderItem={({ item }) => (
          <View
            className={cn(
              "p-2",
              !isLastFixture(item) ? "border-b border-neutral-500" : ""
            )}
          >
            {item.result ? <Result {...item} /> : <Fixture {...item} />}
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text className="text-2xl font-bold text-text dark:text-text-dark p-4 w-full bg-background-light dark:bg-background-dark">
            {title}
          </Text>
        )}
        contentContainerClassName="flex flex-1 w-full gap-2 bg-background-light dark:bg-background-dark"
      />
    </View>
  );
};
