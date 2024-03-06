import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { League, PlayerStats, Team } from "@/lib/types/entities";
import useColor from "@/lib/colors/useColors";

type ModalProps = {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;

  data: {
    season: string;
    teams: Team[];
    leagues: League[];
    playerStats: PlayerStats;
  };
  stats: any;
};

const StatsModal = ({ modalOpen, setModalOpen, data, stats }: ModalProps) => {
  const { season, teams, leagues, playerStats } = data;

  const league = leagues.find((league) => league.id === stats.leagueId);

  const color = useColor();

  return (
    <SafeAreaView className="flex flex-1 bg-background dark:bg-background-dark items-start justify-between w-full">
      <View className="p-6 w-full flex flex-row items-start justify-between">
        <Text className="text-text-light dark:text-text-dark font-bold text-2xl">
          {season} - {league?.name}
        </Text>
        {/* <Button title="Close" onPress={() => setModalOpen(false)} /> */}
        <TouchableOpacity onPress={() => setModalOpen(false)}>
          <Feather name="x" size={24} color={color.ERROR} />
        </TouchableOpacity>
      </View>

      <View className="flex flex-1 w-full p-3 ">
        {Object.keys(stats).map((key, idx) => {
          if (!key.toLowerCase().endsWith("id")) {
            return (
              <View
                key={idx}
                className="flex flex-row items-center justify-between"
              >
                <Text className="text-text-light dark:text-text-dark font-bold text-2xl">
                  {formatHeaders(key)}
                </Text>
                <Text className="text-text-light dark:text-text-dark font-bold text-2xl">
                  {stats[key]}
                </Text>
              </View>
            );
          }
        })}
      </View>
    </SafeAreaView>
  );
};

// Format camel case headers
const formatHeaders = (headers: string) => {
  return headers
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

export default StatsModal;
