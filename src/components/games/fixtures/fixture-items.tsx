import Text from "@/components/ui/Text";
import { Dimensions, View, ScrollView, StyleSheet } from "react-native";
import {
  MiniDateComponent,
  MiniTeam,
  MiniTimeComponent,
} from "./fixture-atoms";
import { AwayTeamType, HomeTeamType } from "@/lib/types/entities";
import { useEffect, useRef, useState } from "react";
import { Image } from "expo-image";

type TeamType = {
  logo?: string;
  name: string;
  teamId: string;
  type: "home" | "away";
};

export type FixtureType = {
  id: string;
  homeTeam: HomeTeamType;
  awayTeam: AwayTeamType;
  date: string;
  time: string;
  fixtureId?: string;
  result?: {
    homeScore: number;
    awayScore: number;
    winner: "Home" | "Away" | "Draw";
  } | null;
  isoDate?: any;
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

export const Fixture = ({
  homeTeam,
  awayTeam,
  date,
  fixtureId,
  result,
  time,
}: FixtureType) => {
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
      <View className="items-center border border-neutral-200 rounded-xl p-2">
        <Text className="text-center text-md font-bold">{time}</Text>
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

export const MiniFixture = ({
  homeTeam,
  awayTeam,
  date,
  fixtureId,
  result,
  time,
}: FixtureType) => {
  if (!homeTeam || !awayTeam) return null;

  return (
    <View className="flex flex-col items-center justify-center w-[230px] gap-2 h-20 rounded-xl border border-white py-1 px-0.5 dark:bg-white">
      <View>
        <MiniDateComponent date={date} />
      </View>
      <View className="flex flex-row items-center justify-around w-full">
        <MiniTeam
          name={homeTeam?.shorthand ?? homeTeam.name.slice(0, 3).toUpperCase()}
          id={homeTeam.id}
          type="Home"
          logo={homeTeam.logo}
        />
        <MiniTimeComponent time={time} />
        <MiniTeam
          name={awayTeam?.shorthand ?? awayTeam.name.slice(0, 3).toUpperCase()}
          id={awayTeam.id}
          type="Away"
          logo={awayTeam.logo}
        />
      </View>
    </View>
  );
};

export const ListFixture = ({
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
      <MiniTimeComponent time={time} />
      <MiniTeam
        name={awayTeam?.shorthand ?? awayTeam.name.slice(0, 3).toUpperCase()}
        id={awayTeam.id}
        type="Away"
        logo={awayTeam.logo}
      />
    </View>
  );
};

const fixtureWidth = 230;
const thirdFixtureWidth = fixtureWidth / 3;
const screenWidth = Dimensions.get("window").width;
const thirdScreenWidth = screenWidth / 5.5;

// Sort fixtures by date
const sortFixturesByDate = (fixtures: FixtureType[]) => {
  return fixtures.sort(
    (a, b) =>
      new Date(a.isoDate ?? a.date).getTime() -
      new Date(b.isoDate ?? b.date).getTime()
  );
};

export const FixtureScroll = ({ fixtures }: { fixtures: FixtureType[] }) => {
  const sortedFixtures = sortFixturesByDate(fixtures);
  const scrollViewRef = useRef<any>(null);
  const [initialOffset, setInitialOffset] = useState(0);

  // Find the index of the fixture that is closest to the current date
  const closestFixtureIndex =
    sortedFixtures.findIndex((fixture) => {
      const fixtureDate = new Date(fixture.isoDate ?? fixture.date);
      const today = new Date();
      return fixtureDate.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0);
    }) < 0
      ? sortedFixtures.length - 1
      : sortedFixtures.findIndex((fixture) => {
          const fixtureDate = new Date(fixture.isoDate ?? fixture.date);
          const today = new Date();
          return fixtureDate.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0);
        });

  // Calculate the initial scroll offset
  useEffect(() => {
    const offset =
      closestFixtureIndex * fixtureWidth - thirdScreenWidth + thirdFixtureWidth;
    setInitialOffset(offset);
  }, [closestFixtureIndex, sortedFixtures]);

  // Scroll to the initial fixture
  useEffect(() => {
    scrollViewRef.current?.scrollTo({ x: initialOffset, animated: false });
  }, [initialOffset]);

  // Scroll to the initial fixture when layout is complete
  const onLayout = () => {
    scrollViewRef.current?.scrollTo({ x: initialOffset, animated: false });
  };

  if (fixtures.length === 0) return null;

  return (
    <ScrollView
      horizontal
      ref={scrollViewRef}
      snapToInterval={fixtureWidth} // Snap to fixtures
      decelerationRate="fast"
      showsHorizontalScrollIndicator={false}
      onLayout={onLayout}
      contentContainerStyle={{
        // Add padding dynamically based on the index of the fixture
        paddingHorizontal: thirdFixtureWidth,
      }}
      contentContainerClassName="gap-4"
    >
      {sortedFixtures.map((fixture, index) => {
        // Apply left margin to the first fixture and right margin to the last
        const isFirstChild = index === 0;
        const isLastChild = index === sortedFixtures.length - 1;
        const marginLeft = isFirstChild
          ? thirdScreenWidth - thirdFixtureWidth
          : 0;
        const marginRight = isLastChild
          ? thirdScreenWidth - thirdFixtureWidth
          : 0;
        return (
          <View style={{ marginLeft, marginRight }} key={fixture.id}>
            {fixtures.length > 0 && <MiniFixture {...fixture} />}
          </View>
        );
      })}
    </ScrollView>
  );
};
