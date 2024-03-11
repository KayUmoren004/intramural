import { View, Text } from "react-native";

export type ResultsType = {
  homeScore: number;
  awayScore: number;
  winner: "Home" | "Away" | "Draw";
};

export const ResultsComponent = ({
  homeScore,
  awayScore,
  winner,
}: ResultsType) => {
  return (
    <View className="flex flex-row items-center gap-2 py-1 px-2 border border-primary rounded-md bg-primary">
      <Text className="font-bold text-white">{homeScore}</Text>
      <Text className="font-bold text-white">-</Text>
      <Text className="font-bold text-white">{awayScore}</Text>
    </View>
  );
};
