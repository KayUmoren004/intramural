import { League } from "@/lib/types/entities";
import { cn } from "@/lib/utils";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { Text, View, TouchableOpacity } from "react-native";

type LeaguesListProps = {
  league: League;
  index: number;
};

const LeaguesList = ({ league, index }: LeaguesListProps) => {
  const { school } = useGlobalSearchParams();
  const { push } = useRouter();

  if (!school) return null;

  const name = league.name;
  console.log("Index: ", index);
  return (
    <TouchableOpacity
      onPress={() =>
        push({
          pathname: `/${school}/(tabs)/(school)/league/${league.name}/${league.id}`,
          params: {
            sportId: league.sportId,
          },
        })
      }
      className={cn(
        "flex flex-1 items-start justify bg-background-light dark:bg-background-dark w-full py-4 px-2 rounded mb-1.5 border-b border-red-500"
      )}
    >
      <Text className="text-text-light dark:text-text-dark">{index}</Text>
      <Text className="text-text-light dark:text-text-dark">{name}</Text>
    </TouchableOpacity>
  );
};

export default LeaguesList;
