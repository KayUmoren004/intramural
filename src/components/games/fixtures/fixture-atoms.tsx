// import Text from "@/components/ui/Text";
import { Image } from "expo-image";
import { View, StyleSheet, Text } from "react-native";
import { format } from "date-fns";
import { AwayTeamType, HomeTeamType } from "@/lib/types/entities";

type TeamType = {
  logo?: string;
  name: string;
  teamId: string;
  type: "home" | "away";
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

const Order = ({ name, id, type, logo }: AwayTeamType | HomeTeamType) => {
  const lType = type.toLowerCase();
  switch (lType) {
    case "home":
      return (
        <View className="gap-2 flex flex-row items-center">
          <Text className="font-bold">{name}</Text>
          <Image
            source={imageMap[lType]}
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
            source={imageMap[lType]}
            contentFit="fill"
            contentPosition="center"
            style={styles.img}
          />
          <Text className="font-bold">{name}</Text>
        </View>
      );

    default:
      break;
  }
};

const OrderBlack = ({ name, id, type, logo }: AwayTeamType | HomeTeamType) => {
  const lType = type.toLowerCase();
  switch (lType) {
    case "home":
      return (
        <View className="gap-2 flex flex-row">
          <Text className="font-bold text-white">{name}</Text>
          <Image
            source={imageMap[lType]}
            contentFit="fill"
            contentPosition="center"
            style={styles.img}
          />
        </View>
      );

    case "away":
      return (
        <View className="gap-2 flex flex-row">
          <Image
            source={imageMap[lType]}
            contentFit="fill"
            contentPosition="center"
            style={styles.img}
          />
          <Text className="font-bold text-white">{name}</Text>
        </View>
      );

    default:
      break;
  }
};

export const Team = ({ name, id, type, logo }: HomeTeamType | AwayTeamType) => {
  return (
    <View className="flex flex-row items-center justify-center w-[150px]">
      <Order {...{ name, id, type, logo }} />
    </View>
  );
};

export const TeamBlack = ({
  name,
  id,
  type,
  logo,
}: HomeTeamType | AwayTeamType) => {
  return (
    <View className="flex flex-row items-center justify-center">
      <OrderBlack {...{ name, id, type, logo }} />
    </View>
  );
};

export const MiniTeam = ({
  name,
  id,
  type,
  logo,
}: HomeTeamType | AwayTeamType) => {
  return (
    <View className="flex flex-row items-center justify-center ">
      <Order {...{ name, id, type, logo }} />
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

export const TimeComponentBlack = ({ time }: { time: string }) => {
  return (
    <View className="p-2 border border-neutral-200 rounded-xl">
      <Text className="text-white">{time}</Text>
    </View>
  );
};

export const MiniTimeComponent = ({ time }: { time: string }) => {
  return (
    <View className="p-1 border border-neutral-200 rounded-md">
      <Text className="text-xs ">{time}</Text>
    </View>
  );
};

export const DateComponent = ({ date }: { date: string }) => {
  return <Text>{date}</Text>;
};

export const MiniDateComponent = ({ date }: { date: string }) => {
  return <Text className="text-xs">{date}</Text>;
};
