import { View, Text } from "react-native";
import { Image } from "expo-image";
import { League, SoccerTable } from "@/lib/types/entities";

export type ListTableProps = {
  pos: number | string;
  logo?: string;
  name: string;
  pts: number | string;
};

const imageMap: { [key: string]: string } = {
  home: require("./home.png"),
  away: require("./away.png"),
};

export const ListTable = ({ data }: { data: SoccerTable | null }) => {
  if (!data)
    return (
      <View className="flex flex-row items-center justify-between w-full">
        <Text>No standings available</Text>
      </View>
    );

  const { position, team, points } = data;
  const { name } = team;

  return (
    <View className="flex flex-row items-center justify-between w-full">
      <View className="flex-row items-center gap-4">
        <Text className="font-bold">{position}</Text>
        <View className="h-2 w-2 rounded-full bg-gray-400" />
        <View className="flex-row items-center gap-2">
          <Image
            source={imageMap.away}
            contentFit="fill"
            contentPosition="center"
            style={{
              height: 25,
              width: 25,
              borderRadius: 25,
            }}
          />
          <Text>{name}</Text>
        </View>
      </View>
      <Text className="font-bold">{points} pts</Text>
    </View>
  );
};
