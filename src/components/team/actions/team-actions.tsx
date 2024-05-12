import CreateTeam from "@/components/school/create-team";
import { JoinTeam } from "@/components/school/join-team";
import { Team } from "@/lib/types/entities";

import { SafeAreaView, View, Text } from "react-native";

type TeamActionsProps = {
  type: "create" | "join";
  leagueId: string;
  userId: string;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  teams?: Team[];
};

const titleMap: {
  [key: string]: {
    label: string;
    component: any;
  };
} = {
  create: {
    label: "Create Team",
    component: CreateTeam,
  },
  join: {
    label: "Join Team",
    component: JoinTeam,
  },
};

const TeamActions = ({
  type,
  leagueId,
  userId,
  setModalOpen,
  teams,
}: TeamActionsProps) => {
  console.log("TeamActionsProps: ", type);

  const Component = titleMap[type].component;
  const title = titleMap[type].label;

  return (
    <SafeAreaView className="flex flex-1 bg-white dark:bg-black flex-col h-full justify-between">
      <View className="my-4 flex flex-col gap-2">
        <Text className="text-text-light dark:text-text-dark text-2xl text-center uppercase font-bold">
          {title}
        </Text>
      </View>

      <Component
        leagueId={leagueId}
        userId={userId}
        setModalOpen={setModalOpen}
        teams={teams ?? []}
      />
    </SafeAreaView>
  );
};

export default TeamActions;
