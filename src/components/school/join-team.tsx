import { useJoinTeam } from "@/hooks/team/useTeam";
import useColor from "@/lib/colors/useColors";
import { Team } from "@/lib/types/entities";
import { cn } from "@/lib/utils";
import { Feather } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  Button,
  SafeAreaView,
  Dimensions,
} from "react-native";
import Loading from "../ui/Loading";
import { AuthButton } from "@/app/(auth)/components/AuthButton";
import { FlashList } from "@shopify/flash-list";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { validateJoinTeam } from "@/lib/forms/useValidation";
import { TextInput } from "react-native";
import AuthInput from "@/app/(auth)/components/AuthInput";
import { Tab } from "../ui/tab";
import { formatTeamsList } from "@/app/(auth)/reuseables";
import Picker from "../picker/Picker";

type JoinTeamProps = {
  teams: Team[];
  leagueId: string | undefined;
  userId: string;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

// Get Screen Dimensions
const { width, height } = Dimensions.get("window");

type ValueType = {
  position: string;
  jerseyNumber: string;
  teamId: string;
  userId: string;
};

const positions = [
  { label: "Goalkeeper", value: "Goalkeeper" },
  { label: "Defender", value: "Defender" },
  { label: "Midfielder", value: "Midfielder" },
  { label: "Forward", value: "Forward" },
];

export const JoinTeam = ({
  teams,
  leagueId,
  setModalOpen,
  userId,
}: JoinTeamProps) => {
  const color = useColor();
  const { joinTeamZod } = validateJoinTeam();
  const [loading, setLoading] = useState<boolean>(false);
  const [next, setNext] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const [selected, setSelected] = useState<string>(positions[0].value);

  const defaultValues: ValueType = {
    position: "",
    jerseyNumber: "",
    teamId: "",
    userId: userId,
  };

  // Form
  const {
    control,
    setFocus,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    watch,
    setValue,
  } = useForm({
    defaultValues,
    resolver: zodResolver(joinTeamZod),
    mode: "onChange",
  });

  const joinTeam = useJoinTeam({
    onSuccess: (data) => {
      console.log(data);
      Alert.alert("Success", "Team Joined Successfully");

      queryClient.invalidateQueries();

      setModalOpen(false);
    },
    onError: (error) => {
      console.log(error);

      Alert.alert("Error", error.message);
    },
  });

  // Submit Flow
  const SubmitFlow = async (values: ValueType) => {
    setLoading(true);

    console.log("Values: ", values);

    const { jerseyNumber, position, teamId } = values;

    try {
      joinTeam.mutate({
        leagueId: leagueId as string,
        teamId: teamId,
        userId,
        jerseyNumber,
        position,
      });
    } catch (error: any) {
      console.log("Error @Join-Team.SubmitFlow: ", error);
    } finally {
      setLoading(false);
    }
  };
  const teamsList = formatTeamsList(teams);

  if (!leagueId) return null;

  return (
    <View className="flex flex-col w-full h-full gap-2 p-3">
      {next && (
        <>
          {/* Jersey  Number */}
          <AuthInput
            config={{
              placeholder: "Jersey Number",
              textContentType: "name",
              keyboardType: "number-pad",
              maxLength: 2,
            }}
            control={control}
            name="jerseyNumber"
          />

          {/* Position */}
          <View>
            {/* Positions */}
            <Text className="text-text-light dark:text-text-dark text-lg font-bold">
              Select Position:
            </Text>
            <Tab
              selectedTab={selected}
              setSelectedTab={(val) => {
                setSelected(val);
                setValue("position", val);
              }}
              tabList={positions}
              containerClassName="rounded-lg bg-white dark:bg-black"
            />
          </View>

          {/* Submit */}
          <AuthButton
            label="Submit"
            onPress={handleSubmit(SubmitFlow)}
            disabled={!isDirty && !isValid}
          />
        </>
      )}

      {/* Team List */}

      {!next && (
        <Picker
          items={teamsList as any}
          onValueChange={(label: string, value: string) => {
            setValue("teamId", value);

            if (value) {
              setNext(true);
            } else {
              console.log("No Team Selected");
            }
          }}
          message="Select a team"
          searchItem="team"
          close={() => {
            const teamId = watch("teamId");

            if (teamId) {
              setNext(true);
            } else {
              console.log("No Team Selected");
            }
          }}
        />
      )}
    </View>
  );
};

// const TeamItem = ({
//   team,
//   selected,
//   onPress,
// }: {
//   team: Team;
//   selected: boolean;
//   onPress: (teamId: string) => void;
// }) => {
//   const color = useColor();
//   return (
//     <View
//       className={cn(
//         "flex flex-row items-center justify-between p-2 w-full ",
//         selected && "opacity-50 dark:opacity-70"
//       )}
//     >
//       <Text className="text-text-light dark:text-text-dark font-bold text-lg">
//         {team.name}
//       </Text>
//       <TouchableOpacity onPress={() => onPress(team.id)}>
//         <Feather
//           name={selected ? "check-circle" : "circle"}
//           size={24}
//           color={color.SUCCESS}
//         />
//       </TouchableOpacity>
//     </View>
//   );
// };

export const TeamItem = ({
  team,

  onPress,
  lastItem,
}: {
  team: Team;
  lastItem?: boolean;
  onPress: (teamId: string) => void;
}) => {
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const selected = selectedTeamId === team.id;

  return (
    <TouchableOpacity
      onPress={() => {
        setSelectedTeamId(team.id);
        onPress(team.id);
      }}
      className={cn(
        "flex flex-row gap-2 items-center justify-between w-full  py-2",
        [
          selected && "opacity-50 dark:opacity-70",
          lastItem ? "border-b-0" : "border-b border-neutral-500",
        ]
      )}
    >
      <View className="gap-2 flex flex-row items-center justify-center">
        <TeamLogo team={team} />
        <View className="flex flex-col items-start justify-center gap-1 ">
          <Text className="text-text-light dark:text-text-dark font-bold">
            {team.name}
          </Text>
          <Text className="text-neutral-500">Captain: {team.captain.name}</Text>
        </View>
      </View>
      <Feather
        name={selected ? "check-circle" : "circle"}
        size={24}
        color="green"
      />
    </TouchableOpacity>
  );
};

const TeamLogo = ({ team }: { team: Team }) => {
  const name = team.name;
  //   const logoUrl = user.avatarUrl;
  //   const blurhash = user.blurhash;

  const initials = name
    .split(" ")
    .map((n: string) => n.charAt(0))
    .join("")
    .toUpperCase();

  //   if (!logoUrl || logoUrl === "" || logoUrl.length === 0) {
  return (
    <View className="bg-success-light dark:bg-success-dark p-2 h-12 w-12 flex items-center justify-center rounded-full">
      <Text className="text-text-light dark:text-text-dark text-center font-bold text-xl">
        {initials}
      </Text>
    </View>
  );
};
