import Text from "@/components/ui/Text";
import { View } from "react-native";
import { DateComponent, Team, TimeComponent } from "./fixture-atoms";
import { generateBoxShadowStyle } from "@/scripts/box-shadow";
import { AwayTeamType, HomeTeamType } from "@/lib/types/entities";

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
};

const Fixture = ({
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

export default Fixture;
