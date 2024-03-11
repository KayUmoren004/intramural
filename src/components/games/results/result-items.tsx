import { View } from "react-native";
import { FixtureType } from "../fixtures/fixture-items";
import { MiniTeam } from "../fixtures/fixture-atoms";
import { ResultsComponent, ResultsType } from "./result-atoms";

const FakeResultsType: ResultsType = {
  homeScore: 1,
  awayScore: 0,
  winner: "Home",
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
