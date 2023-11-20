import { Text, View } from "react-native";
import type { League, PlayerStats, Team } from "../../../lib/types/entities";

type InformationProps = {
  title: string;
  data?: {
    season: string;
    teams: Team[];
    leagues: League[];
    playerStats: PlayerStats;
  };
  type: "currentSeason" | "playerStats";
};

const Information = ({ title, data, type }: InformationProps) => {
  // Deco

  switch (type) {
    case "currentSeason":
      return <CurrentSeason title={title} data={data} />;
    case "playerStats":
      return <PlayerStats title={title} data={data} />;
    default:
      return null;
  }
};

export default Information;

const CurrentSeason = ({
  title,
  data,
}: {
  data: InformationProps["data"];
  title: string;
}) => {
  if (!data) return null;

  // Deconstruct data
  const { season, teams, leagues, playerStats } = data;

  return (
    <View className="flex flex-col justify-between items-start w-full mb-10">
      <Text className="text-text-light dark:text-text-dark font-bold text-2xl">
        {title}:
      </Text>
      <View className="">
        <Text className="text-text-light dark:text-text-dark">
          Season: {season}
        </Text>

        {/* Leagues */}
        {leagues.map((league, index) => {
          return (
            <View className="">
              <Text className="text-text-light dark:text-text-dark font-bold">
                {league.name}
              </Text>

              {/* Teams */}
              {
                // Find teams that has the same leagueId as the current league
                teams
                  .filter((team) => team.leagueId === league.id)
                  .map((team) => {
                    return (
                      <View className="">
                        <Text className="text-text-light dark:text-text-dark">
                          {team.name}
                        </Text>

                        {/* Stats */}
                      </View>
                    );
                  })
              }
            </View>
          );
        })}
      </View>
    </View>
  );
};

const PlayerStats = ({
  data,
  title,
}: {
  data: InformationProps["data"];
  title: string;
}) => {
  return (
    <View className="flex flex-row justify-between items-center w-full mb-10">
      <Text className="text-text-light dark:text-text-dark font-bold text-2xl">
        {/* {data?.playerStats} */}
        {title}
      </Text>
    </View>
  );
};
