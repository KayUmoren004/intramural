import Loading from "@/components/ui/Loading";
import { useGetGame } from "@/hooks/game/useGame";
import { useRefetchOnFocus } from "@/hooks/useRefectOnFocus";
import { Game } from "@/lib/types/entities";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  LayoutChangeEvent,
  Pressable,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Tab } from "@/components/ui/tab";
import { useState } from "react";
import { league } from "@/hooks/league/league.requests";
import { MaterialIcons } from "@expo/vector-icons";
import { MoveRight } from "lucide-react-native";
import { cn } from "@/lib/utils";
import { buildFixture } from "@/hooks/fixture/fixture-utils";
import { MiniFixture } from "../../league/[league]/[leagueId]/imports";

type IndexProps = {};

// Create an array and fill it with numbers from 0 to 99 in ascending order
const data = Array.from({ length: 100 }, (_, i) => i);

// Header Size
const headerSize = Dimensions.get("screen").height * 0.3;
const headerTop = 44 - 16;

type TabProp = {
  label: string;
  value: string;
};

const tabList: TabProp[] = [
  {
    label: "Info",
    value: "info",
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
  const { school, gameId, fixtureId } = useLocalSearchParams<{
    school: string;
    gameId: string;
    fixtureId: string;
  }>();

  const { push } = useRouter();

  const {
    data: game,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetGame(gameId ?? "");
  useRefetchOnFocus(refetch, true);

  // States
  const [selectedTab, setSelectedTab] = useState<string>(tabList[0].value);

  const { top } = useSafeAreaInsets();
  // const {} = useSafeAreaFrame();

  const sv = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      "worklet";
      sv.value = event.contentOffset.y;
    },
  });

  if (isLoading)
    return (
      <>
        <Stack.Screen
          options={{
            headerTitle: "Game",
            headerBackTitle: "Back",
            // headerShown: false,
            // header: () => <GameHeader game={game} sv={sv} />,
          }}
        />
        <View className="bg-background-light dark:bg-background-dark flex-1 items-center justify-center">
          <Loading />
        </View>
      </>
    );

  if (isError) {
    console.log("Error @Game: ", error);
    return (
      <>
        <Stack.Screen
          options={{
            headerTitle: "Game",
            headerBackTitle: "Back",
            // headerShown: false,
            // header: () => <GameHeader game={game} sv={sv} />,
          }}
        />
        <View className="bg-background-light dark:bg-background-dark flex-1 items-center justify-center">
          <Text className="text-red-500">{error.message}</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerBackTitle: "Back",
          headerShown: true,
          headerTitle: "Game",
          // header: () => <GameHeader game={game} sv={sv} />,
        }}
      />
      <Tab
        tabList={tabList}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      {selectedTab === "info" && (
        <View
          className="
      flex flex-1 bg-background-light dark:bg-background-dark w-full gap-2 px-4 "
        >
          <InformationComponent game={game} header="Fixture" />
          <InformationComponent
            game={game}
            header="League"
            icon={true}
            onPress={() =>
              push({
                pathname: `/${school}/(tabs)/(school)/league/${game?.league.name}/${game?.leagueId}`,
                params: {
                  sportId: game?.league?.sportId,
                },
              })
            }
          />
          <InformationComponent game={game} header="Team" />
        </View>
      )}
    </>
  );
};

export default Index;

const InformationComponent = ({
  game,
  header,
  icon,
  onPress,
}: {
  game: Game | undefined;
  header: string;
  icon?: boolean;
  onPress?: () => void;
}) => {
  const InfoComponent = componentMap[header];
  return (
    <Pressable onPress={onPress}>
      <View className="w-full h-fit border border-neutral-300 rounded flex flex-col items-start justify-between bg-black dark:bg-white">
        <View className="w-full flex-row items-center justify-between border-b border-neutral-300 p-2">
          <Text className="text-neutral-400 font-medium text-sm">{header}</Text>
          {icon && <MoveRight />}
        </View>
        <View className="w-full p-2">
          <InfoComponent game={game} />
        </View>
      </View>
    </Pressable>
  );
};

const LeagueComponent = ({ game }: { game: Game | undefined }) => {
  return (
    <View className="flex-row items-center justify-start  gap-2">
      <MaterialIcons name="sports-soccer" size={24} color="black" />
      <Text className="text-white dark:text-black font-bold">
        {game?.league?.name ?? "No League"}
      </Text>
    </View>
  );
};

const TeamsComponent = ({ game }: { game: Game | undefined }) => {
  const { push } = useRouter();
  const { school } = useLocalSearchParams<{ school: string }>();

  const homeTeam = game?.teams?.find((team) => team.id === game.homeId);
  const awayTeam = game?.teams?.find((team) => team.id === game.awayId);

  // Append (H) or (A) to the team name
  const homeTeamName = homeTeam?.name + " (H)";
  const awayTeamName = awayTeam?.name + " (A)";

  return (
    <View className="flex-col items-start justify-start gap-2 w-full">
      <Pressable
        onPress={() =>
          push({
            pathname: `/${school}/(tabs)/(school)/team/${homeTeamName}/${homeTeam?.id}`,
            params: {
              leagueId: homeTeam?.leagueId,
            },
          })
        }
        className="flex flex-row items-center justify-between  w-full"
      >
        <View className={cn("flex-row items-center justify-start gap-2")}>
          <MaterialIcons name="sports-soccer" size={24} color="black" />
          <Text className="">{homeTeamName}</Text>
        </View>
        <MoveRight />
      </Pressable>
      <View className="h-[0.5px] bg-neutral-300 w-full" />
      <Pressable
        onPress={() =>
          push({
            pathname: `/${school}/(tabs)/(school)/team/${awayTeamName}/${awayTeam?.id}`,
            params: {
              leagueId: awayTeam?.leagueId,
            },
          })
        }
        className="flex flex-row items-center justify-between  w-full"
      >
        <View className={cn("flex-row items-center justify-start gap-2")}>
          <MaterialIcons name="sports-soccer" size={24} color="black" />
          <Text className="">{awayTeamName}</Text>
        </View>
        <MoveRight />
      </Pressable>
    </View>
  );
};

const FixtureComponent = ({ game }: { game: Game | undefined }) => {
  if (!game?.fixture) return null;

  const fixture = buildFixture(game.fixture);

  console.log("Fixture", fixture);

  return <MiniFixture {...fixture} />;

  // return (
  //   <View className="flex-row items-center justify-start gap-2">
  //     <MaterialIcons name="sports-soccer" size={24} color="black" />
  //     <Text className="text-white dark:text-black font-bold">
  //       {game.id}
  //     </Text>
  //   </View>
  // );
};

const componentMap: {
  [key: string]: React.FC<{ game: Game | undefined }>;
} = {
  League: LeagueComponent,
  Team: TeamsComponent,
  Fixture: FixtureComponent,
};
