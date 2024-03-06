import Text from "@/components/ui/Text";
import { Image } from "expo-image";
import { View, StyleSheet } from "react-native";
import { format } from "date-fns";

type TeamType = {
  logo?: string;
  name: string;
  teamId: string;
  type: "home" | "away";
};

type ResultsType = {
  homeScore: number;
  awayScore: number;
  winner: "Home" | "Away" | "Draw";
};

const imageMap: { [key: string]: string } = {
  home: require("./home.png"),
  away: require("./away.png"),
};

const styles = StyleSheet.create({
  img: {
    height: 30,
    width: 30,
    borderRadius: 25,
  },
});

const Order = ({ name, teamId, type, logo }: TeamType) => {
  switch (type) {
    case "home":
      return (
        <View className="gap-2 flex flex-row items-center">
          <Text>{name}</Text>
          <Image
            source={imageMap[type]}
            contentFit="fill"
            contentPosition="center"
            style={styles.img}
          />
        </View>
      );

    case "away":
      return (
        <View className="gap-2 flex flex-row items-center">
          <Image
            source={imageMap[type]}
            contentFit="fill"
            contentPosition="center"
            style={styles.img}
          />
          <Text>{name}</Text>
        </View>
      );

    default:
      break;
  }
};

export const Team = ({ name, teamId, type, logo }: TeamType) => {
  return (
    <View className="flex flex-row items-center justify-center w-[150px]">
      <Order {...{ name, teamId, type, logo }} />
    </View>
  );
};

export const TimeComponent = ({ time }: { time: string }) => {
  return (
    <View className="p-2 border border-neutral-200 rounded-xl">
      <Text>{time}</Text>
    </View>
  );
};

export const DateComponent = ({ date }: { date: string }) => {
  const formattedDate = format(new Date(date), "PPP");
  return <Text>{formattedDate}</Text>;
};

export const Results = ({ homeScore, awayScore, winner }: ResultsType) => {};
