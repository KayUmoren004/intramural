import type { GeneralModal } from "@/lib/types/UI";
import { Modal, Text, View } from "react-native";
import { Header } from "./components/header";
import { SoccerTable } from "@/lib/types/entities";
import { DataTable } from "react-native-paper";
import { buildTable, getTableHeaders } from "./components/table-utils";
import { sportHeaders, sporttable } from "@/lib/types/headers";
import Table from "../table";

export const TablesModal = ({
  isOpen,
  onClose,
  onChange,
  title,
  league,
}: GeneralModal) => {
  const rawTable = league?.soccerTable as SoccerTable[];
  const table = buildTable(rawTable);
  const headers = getTableHeaders(rawTable);
  const header = sportHeaders["soccer"];

  const tableObj: sporttable = {
    headers: header,
    teams: table,
  };

  return (
    <Modal
      animationType="slide"
      visible={isOpen}
      onRequestClose={() => onClose(false)}
      presentationStyle="formSheet"
    >
      <View
        className="
      flex flex-1 bg-background-light dark:bg-background-dark w-full"
      >
        <Header title={title} />
        <View className="flex flex-1 w-full my-8">
          {/* <View className="flex flex-row items-center justify-between w-full border-b border-neutral-400 pb-2">
            <Text className="text-text-light dark:text-text-dark text-2xl">
              Standings
            </Text>
          </View>
          {table.map((team, index) => {
            return (
              <DataTable.Row key={team.id}>
                <DataTable.Cell>
                  <Text className="text-white dark:text-text-dark">
                    {team.position}
                  </Text>
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
                    <DataTable.Cell key={idx}>
                      <View className="w-full">
                        <Text className="text-white dark:text-text-dark ">
                          {stat}
                        </Text>
                      </View>
                    </DataTable.Cell>
                  );
                })}
              </DataTable.Row>
            );
          })} */}
          <Table table={tableObj} scroll={true} />
        </View>
      </View>
    </Modal>
  );
};
