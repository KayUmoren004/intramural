import { Text, TouchableOpacity, View } from "react-native";
import CachedImage from "expo-cached-image";
import { League, PlayerStats, Team } from "@/lib/types/entities";

type TeamCardProps = {
  team: Team;
  data: PlayerStats;
  league: League[];
  season: string;
  onPress: (stats: any) => void;
};

const TeamCard = ({ team, onPress, data, league, season }: TeamCardProps) => {
  // Match the team to the stats
  const teamStats = data.stats.find((stat) => stat.teamId === team.id);

  // Match the league to the team
  const teamLeague = league.find((league) => league.id === team.leagueId);

  return (
    <TouchableOpacity
      className="
             w-full border-2 border-primary rounded-md p-3 mb-3 "
      onPress={() => onPress(teamStats)}
    >
      <View className="flex flex-row justify-between items-start  w-full">
        <View className="w-fit ">
          <CachedImage
            source={{ uri: team.logoUrl, expiresIn: 2_628_288 }}
            cacheKey={`${team.id}-team-logo`}
            placeholderContent={
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 16,
                  backgroundColor: "#17A2B8",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: (100 + 50) / 2,
                    fontWeight: "bold",
                    textAlign: "center",
                    textAlignVertical: "center",
                  }}
                >
                  {team.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            }
            resizeMode="cover"
            style={{ width: 75, height: 75, borderRadius: 16 }}
          />
        </View>
        <View
          className="
              flex flex-col w-full px-2"
        >
          {/* Top Banner */}
          <View className="flex flex-row justify-between items-start  w-5/6">
            <Text className="text-text-light dark:text-text-dark font-bold text-xl">
              {team.name}
            </Text>
            {/* <Text className="text-text-light dark:text-text-dark">|</Text> */}
            <Text className="text-text-light dark:text-text-dark font-thin text-lg">
              {team.wins} - {team.losses} - {team.ties}
            </Text>
          </View>
          <Text className="text-text-light dark:text-text-dark font-thin text-lg">
            {teamLeague?.name} | {season}
          </Text>
          <Text className="text-text-light dark:text-text-dark font-thin text-lg">
            Captain: {team.captain.name ?? "Unknown"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TeamCard;
