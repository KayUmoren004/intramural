import Text from "@/components/ui/Text";
import { Dimensions, View, ScrollView, StyleSheet } from "react-native";
import { FixtureType } from "../fixtures/fixture-items";
import { MiniTeam } from "../fixtures/fixture-atoms";
import { ResultsComponent, ResultsType } from "./result-atoms";
import { Image } from "expo-image";

const FakeResultsType: ResultsType = {
  homeScore: 1,
  awayScore: 0,
  winner: "Home",
};

const imageMap: { [key: string]: string } = {
  home: require("./home.png"),
  away: require("./away.png"),
};

const styles = StyleSheet.create({
  img: {
    height: 30,
    width: 30,
    borderRadius: 25,
  },
});

export const Result = ({
  homeTeam,
  awayTeam,
  date,
  fixtureId,
  result,
  time,
  isoDate,
}: FixtureType) => {
  // Do not render if the iso date is in the future or if the date is not today
  if (
    new Date(isoDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
  ) {
    return null;
  }

  const { homeScore, awayScore } = result as ResultsType;
  return (
    <View className="flex flex-row items-center justify-center p-2 gap-2">
      <View className="w-1/3">
        <Text className="text-right font-bold">{homeTeam.name}</Text>
      </View>
      <Image
        source={imageMap["home"]}
        contentFit="fill"
        contentPosition="center"
        style={styles.img}
      />
      <View className="flex flex-row items-center gap-2 py-1 px-2 border border-primary rounded-md bg-primary">
        <Text className="font-bold text-white text-lg">{homeScore}</Text>
        <Text className="font-bold text-white text-lg">-</Text>
        <Text className="font-bold text-white text-lg">{awayScore}</Text>
      </View>
      <Image
        source={imageMap["away"]}
        contentFit="fill"
        contentPosition="center"
        style={styles.img}
      />
      <View className="w-1/3">
        <Text className="text-left font-bold">{awayTeam.name}</Text>
      </View>
    </View>
  );
};

export const ListResult = ({
  homeTeam,
  awayTeam,
  date,
  fixtureId,
  result,
  time,
}: FixtureType) => {
  if (!homeTeam || !awayTeam) return null;

  return (
    <View className="flex-row items-center gap-2">
      <MiniTeam
        name={homeTeam?.shorthand ?? homeTeam.name.slice(0, 3).toUpperCase()}
        id={homeTeam.id}
        type="Home"
        logo={homeTeam.logo}
      />

      <ResultsComponent {...(result ?? FakeResultsType)} />
      <MiniTeam
        name={awayTeam?.shorthand ?? awayTeam.name.slice(0, 3).toUpperCase()}
        id={awayTeam.id}
        type="Away"
        logo={awayTeam.logo}
      />
    </View>
  );
};
