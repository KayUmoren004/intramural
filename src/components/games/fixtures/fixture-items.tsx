import Text from "@/components/ui/Text";
import { Dimensions, View, ScrollView } from "react-native";
import {
  DateComponent,
  MiniDateComponent,
  MiniTeam,
  MiniTimeComponent,
  Team,
  TimeComponent,
} from "./fixture-atoms";
import { generateBoxShadowStyle } from "@/scripts/box-shadow";
import { AwayTeamType, HomeTeamType } from "@/lib/types/entities";
import { useEffect, useRef, useState } from "react";

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
  };
  isoDate?: any;
};

export const Fixture = ({
  homeTeam,
  awayTeam,
  date,
  fixtureId,
  result,
  time,
}: FixtureType) => {
  const shadow = generateBoxShadowStyle(-2, 4, "#171717", 0.2, 3, 4, "#171717");
  return (
    <View
      style={
        {
          // ...shadow,
        }
      }
      className="flex flex-col items-center justify-center w-full h-20 rounded-xl gap-2 border border-slate-600 py-1 px-0.5 dark:bg-slate-600"
    >
      <View className="flex flex-row items-center justify-between w-full">
        <Team {...homeTeam} />
        <TimeComponent time={time} />
        <Team {...awayTeam} />
      </View>
      <View>
        <DateComponent date={date} />
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
  const closestFixtureIndex = sortedFixtures.findIndex((fixture) => {
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
