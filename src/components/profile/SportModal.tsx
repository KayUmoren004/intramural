import {
  View,
  Text,
  SafeAreaView,
  Button,
  TouchableOpacity,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import { League, PlayerStats, Team } from "@/lib/types/entities";
import {
  basketballTeams,
  soccerTeams,
  sportHeaders,
  sporttable,
  volleyballTeams,
} from "@/lib/types/headers";
import useColor from "@/lib/colors/useColors";
import Table from "@/components/table";

type ModalProps = {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;

  data: {
    season: string;
    teams: Team[];
    leagues: League[];
    playerStats: PlayerStats;
  };
  league: League;
};

const sportsDataMap = {
  soccer: soccerTeams,
  basketball: basketballTeams,
  volleyball: volleyballTeams,
};

// Method to return the correct data based on the sport
const getSportData = (sportName: string) => {
  // if (sportName.includes("soccer")) {
  //   return sportsDataMap.soccer;
  // }
  switch (sportName) {
    case "soccer":
      return sportsDataMap.soccer;

    case "basketball":
      return sportsDataMap.basketball;

    case "volleyball":
      return sportsDataMap.volleyball;
    default:
      return null;
  }
};

const SportModal = ({ modalOpen, setModalOpen, data, league }: ModalProps) => {
  const { season, teams, leagues, playerStats } = data;

  // Find team based on league
  const team = teams.find((team) => team.leagueId === league?.id);

  const sportName = league?.name.trim().toLowerCase();

  // Convert sportName to camel case (e.g., "Cross Country" to "crossCountry")
  const sportNameInCamelCase = sportName
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");

  // Find the correct headers for the sport (camel case keys)
  const header = sportHeaders[sportNameInCamelCase];

  const table: sporttable = {
    headers: header,
    teams: getSportData(sportName) ?? [],
  };

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
        <Table table={table} />
      </View>
    </SafeAreaView>
  );
};

export default SportModal;
