import { View, Text } from "react-native";
import React from "react";
import { sportteam } from "../../../lib/types/headers";

type TableBodyProps = {
  data: any;
};

export const TableBody = ({ data }: TableBodyProps) => {
  return data.map((team: sportteam, idx: number) => {
    const { Team, stats, Form } = team;

    return (
      <View className="flex flex-row w-full items-start" key={idx}>
        <View className="flex flex-row items-start justify-between w-1/2">
          <Text className="text-text-light dark:text-text-dark font-semibold">
            {Team}
          </Text>
        </View>
        <View className="flex flex-row items-start justify-center w-1/2">
          {Object.values(stats).map((stat: any, idx: number) => {
            return (
              <Text key={idx} className="text-text-light dark:text-text-dark">
                {stat}
              </Text>
            );
          })}
        </View>
      </View>
    );
  });
};
