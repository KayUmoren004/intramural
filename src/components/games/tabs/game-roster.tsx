import { FAB } from "@rneui/themed";
import Text from "@/components/ui/Text";
import { Game } from "@/lib/types/entities";
import { Modal, View, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import useColor from "@/lib/colors/useColors";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useState } from "react";
import { GameAttendance } from "./game-attendance";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RosterItem, RosterTab } from "@/components/team/tabs/roster";

export const Roster = ({ game }: { game: Game | undefined }) => {
  const colors = useColor();
  const tabBarHeight = useBottomTabBarHeight();
  const [modalVisible, setModalVisible] = useState(false);

  const { homeId, awayId, roster, teams } = game || ({} as Game);

  const homeTeam = teams.find((team) => team.id === homeId);
  const awayTeam = teams.find((team) => team.id === awayId);

  const homeRoster = roster?.home;
  const awayRoster = roster?.away;

  const lastHomePlayer = homeRoster?.[homeRoster.length - 1];
  const lastAwayPlayer = awayRoster?.[awayRoster.length - 1];

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="items-center justify-center"
        className="flex flex-col  w-full h-full bg-white dark:bg-black"
      >
        <View className="w-full h-full p-2">
          <Accordion
            type="single"
            collapsible
            className="w-full max-w-sm native:max-w-md"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <Text className="text-xl font-bold">
                  {homeTeam?.name} (Home)
                </Text>
              </AccordionTrigger>
              <AccordionContent>
                {homeRoster?.map((player) => (
                  <RosterItem
                    key={player.id}
                    player={player}
                    captainId={homeTeam?.captainId ?? ""}
                    lastItem={player === lastHomePlayer}
                  />
                ))}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                <Text className="text-xl font-bold">
                  {awayTeam?.name} (Away)
                </Text>
              </AccordionTrigger>
              <AccordionContent>
                {awayRoster?.map((player) => (
                  <RosterItem
                    key={player.id}
                    player={player}
                    captainId={awayTeam?.captainId ?? ""}
                    lastItem={player === lastAwayPlayer}
                  />
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </View>
      </ScrollView>
      <FAB
        visible={true}
        onPress={() => setModalVisible(true)}
        placement="right"
        color={colors.PRIMARY}
        style={{ position: "absolute", bottom: 0, right: 0 }}
        icon={<Feather name="git-pull-request" size={24} color="white" />}
      />
      <GameAttendance
        game={game ?? ({} as Game)}
        visible={modalVisible}
        onClose={setModalVisible}
      />
    </>
  );
};
