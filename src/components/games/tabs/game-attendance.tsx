import { AuthButton } from "@/app/(auth)/components/AuthButton";
import { Header } from "@/components/league/components/header";
import { Tab } from "@/components/ui/tab";
import Text from "@/components/ui/Text";
import {
  Game,
  type GameAttendance as GA,
  Player,
  Roster,
  Team,
} from "@/lib/types/entities";
import { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  View,
} from "react-native";
import Checkbox from "expo-checkbox";
import { useAddAttendance } from "@/hooks/game/useGame";
import { useQueryClient } from "@tanstack/react-query";
import { GameAttendanceBody } from "@/hooks/game/game.requests";

type TabProp = {
  label: string;
  value: string;
};

interface AttendanceResult {
  home: string[];
  away: string[];
}

// Game Attendance initial data
const initialAttendance = (
  homeId: string,
  awayId: string,
  attendance: GA[] | undefined
): AttendanceType => {
  let home: string[] = [];
  let away: string[] = [];

  const homeTeamAttendance = attendance
    ?.filter((att) => att.teamId === homeId && att.attended)
    .map((att) => att.playerId)
    .filter((id) => id != null);

  const awayTeamAttendance = attendance
    ?.filter((att) => att.teamId === awayId && att.attended)
    .map((att) => att.playerId)
    .filter((id) => id != null);

  if (homeTeamAttendance) {
    home = homeTeamAttendance;
  }

  if (awayTeamAttendance) {
    away = awayTeamAttendance;
  }

  return { home, away };
};

export const GameAttendance = ({
  game,
  visible,
  onClose,
}: {
  game: Game;
  visible: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { homeId, awayId, roster, teams } = game;

  const homeTeam = teams.find((team) => team.id === homeId);
  const awayTeam = teams.find((team) => team.id === awayId);

  const homeRoster = roster?.home;
  const awayRoster = roster?.away;

  const tabList: TabProp[] = [
    {
      label: `${homeTeam?.name} (Home)`,
      value: "home",
    },
    {
      label: `${awayTeam?.name} (Away)`,
      value: "away",
    },
  ];

  const [selectedTab, setSelectedTab] = useState<string>(tabList[0].value);
  const [attendance, setAttendance] = useState<AttendanceType>(
    initialAttendance(homeId, awayId, game?.attendance)
  );

  const queryClient = useQueryClient();
  const submitAttendance = useAddAttendance({
    onSuccess: (data) => {
      console.log("Attendance submitted: ", data);

      queryClient.invalidateQueries();
      Alert.alert("Success", "Attendance submitted successfully");
      onClose(false);
    },
    onError: (error) => {
      console.log("Error submitting attendance: ", error);
      Alert.alert("Error", `Failed to submit attendance: ${error.message}`);
    },
  });

  // Build attendance body
  const buildAttendanceBody = () => {
    let attendanceBody: any = [];

    // Home team attendance
    attendanceBody.push({
      teamId: homeId,
      players: attendance.home,
    });

    // Away team attendance
    attendanceBody.push({
      teamId: awayId,
      players: attendance.away,
    });

    const body = {
      gameId: game.id,
      attendance: attendanceBody,
    } as GameAttendanceBody;

    return body;
  };

  return (
    <Modal
      animationType="slide"
      visible={visible}
      onRequestClose={() => onClose(false)}
      presentationStyle="formSheet"
    >
      <SafeAreaView
        className="
      flex flex-1 bg-background-light dark:bg-background-dark w-full"
      >
        <Header title="Game Attendance" elevated />

        {/* Body */}
        <Tab
          tabList={tabList}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />

        {selectedTab === "home" && (
          <AttendanceComponent
            roster={homeRoster}
            type="home"
            attendance={attendance}
            setAttendance={setAttendance}
          />
        )}
        {selectedTab === "away" && (
          <AttendanceComponent
            roster={awayRoster}
            type="away"
            attendance={attendance}
            setAttendance={setAttendance}
          />
        )}
        <AuthButton
          className="px-4 mt-2"
          label="Confirm"
          onPress={() => submitAttendance.mutate(buildAttendanceBody())}
          // disabled
        />
      </SafeAreaView>
    </Modal>
  );
};

type AttendanceType = {
  [key: string]: string[];
};

const AttendanceComponent = ({
  roster,
  type,
  attendance,
  setAttendance,
}: {
  roster: Player[] | undefined;
  type: "home" | "away";
  attendance: AttendanceType;
  setAttendance: React.Dispatch<React.SetStateAction<AttendanceType>>;
}) => {
  // Add to attendance
  const addToAttendance = (playerId: string) => {
    // Look for player in attendance
    const playerIndex = attendance[type].indexOf(playerId);

    // If player is in attendance, remove them
    if (playerIndex > -1) {
      setAttendance({
        ...attendance,
        [type]: attendance[type].filter((id: string) => id !== playerId),
      });
    } else {
      setAttendance({
        ...attendance,
        [type]: [...attendance[type], playerId],
      });
    }
  };

  return (
    <View className="flex flex-1 items-start justify-between">
      <ScrollView
        contentContainerClassName="gap-4 p-2 items-center justify-center"
        className="flex-1 w-full "
      >
        {roster?.map((player, index) => (
          <AttendanceItem
            key={player.id}
            player={player}
            lastItem={index === roster.length - 1}
            setAttendance={addToAttendance}
            checked={attendance[type].includes(player.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const AttendanceItem = ({
  player,
  lastItem,
  setAttendance,
  checked,
}: {
  player: Player | undefined;
  lastItem: boolean;
  setAttendance: (playerId: string) => void;
  checked: boolean;
}) => {
  const [isChecked, setChecked] = useState<boolean>(checked);

  const handleCheck = () => {
    setChecked(!isChecked);
    setAttendance(player?.id ?? "");
  };

  return (
    <Pressable
      onPress={handleCheck}
      className={`
      flex flex-row items-center justify-between
      p-2 w-full 
      ${lastItem ? "" : "border-b border-neutral-500"}
      `}
    >
      <Text>{player?.user?.name}</Text>
      <Checkbox value={isChecked} onValueChange={handleCheck} />
    </Pressable>
  );
};
