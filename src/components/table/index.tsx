import { View, Text, FlatList } from "react-native";
import React from "react";
import TableHeader from "./TableHeader";

import { TableBody } from "./TableBody";
import { DataTable } from "react-native-paper";
import { FlashList } from "@shopify/flash-list";
import { sportheaders, sporttable, sportteam } from "@/lib/types/headers";

type TableProps = {
  table: sporttable;
  scroll?: boolean;
};

const Table = ({ table, scroll }: TableProps) => {
  const { headers, teams } = table;
  console.log("Table Teams", teams);
  return (
    <DataTable className="">
      <View className="">
        <DataTable.Header>
          <DataTable.Title>
            <Text className="text-white"></Text>
          </DataTable.Title>
          <View className="w-1/2">
            <DataTable.Title>
              <Text className="text-white font-bold dark:text-text-dark">
                {headers[1].name.toUpperCase()}
              </Text>
            </DataTable.Title>
          </View>

          {headers.map((header: sportheaders, idx: number) => {
            const { name, main, shorthand } = header;

            // Remove form from table
            if (name === "Form") return null;
            return main ? null : (
              <DataTable.Title
                style={{
                  alignItems: "center",
                  alignContent: "center",
                  justifyContent: "center",
                }}
                key={idx}
              >
                <Text className="text-white font-bold dark:text-text-dark">
                  {shorthand}
                </Text>
              </DataTable.Title>
            );
          })}
        </DataTable.Header>
      </View>

      <FlatList
        data={teams}
        renderItem={({ item }) => <RenderData team={item} />}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 5 }}
        scrollEnabled={scroll}
      />
    </DataTable>
  );
};

// Teams Component for FlashList
const RenderData = ({ team }: { team: sportteam }) => {
  return (
    <DataTable.Row>
      <DataTable.Cell>
        <Text className="text-white dark:text-text-dark">{team.position}</Text>
      </DataTable.Cell>
      <View className="w-1/2">
        <DataTable.Cell>
          <Text className="text-white dark:text-text-dark">
            {team.Team.name}
          </Text>
        </DataTable.Cell>
      </View>
      {Object.values(team.stats).map((stat: any, idx: number) => {
        return (
          <DataTable.Cell
            style={{
              // backgroundColor: "red",
              alignItems: "center",
              alignContent: "center",
              justifyContent: "center",
            }}
            key={idx}
          >
            <Text className="text-white dark:text-text-dark">{stat}</Text>
          </DataTable.Cell>
        );
      })}
    </DataTable.Row>
  );
};

export default Table;
