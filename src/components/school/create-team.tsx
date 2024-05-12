import AuthInput from "@/app/(auth)/components/AuthInput";
import useColor from "@/lib/colors/useColors";
import { validateCreateTeam } from "@/lib/forms/useValidation";
import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import Loading from "../ui/Loading";
import { AuthButton } from "@/app/(auth)/components/AuthButton";
import { useCreateTeam } from "@/hooks/team/useTeam";
import { useQueryClient } from "@tanstack/react-query";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { EllipsisVertical } from "lucide-react-native";
import { Tab } from "../ui/tab";

type CreateTeamProps = {
  captainId: string;
  leagueId: string | undefined;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type ValueType = {
  name: string;
  shortName: string;
  position: string;
  jerseyNumber: string;
};

const shortNameSuffix = [];

const defaultValues: ValueType = {
  name: "",
  shortName: "",
  position: "",
  jerseyNumber: "",
};

const positions = [
  { label: "Goalkeeper", value: "Goalkeeper" },
  { label: "Defender", value: "Defender" },
  { label: "Midfielder", value: "Midfielder" },
  { label: "Forward", value: "Forward" },
];

const CreateTeam = ({ captainId, leagueId, setModalOpen }: CreateTeamProps) => {
  const color = useColor();
  const { createTeamZod } = validateCreateTeam();
  const [loading, setLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const [open, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>(positions[0].value);

  // Form
  const {
    control,
    setFocus,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    setValue,
    watch,
  } = useForm({
    defaultValues,
    resolver: zodResolver(createTeamZod),
    mode: "onChange",
  });

  console.log("Watch: ", watch());

  const createTeam = useCreateTeam({
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries();

      Alert.alert("Success", "Team Created Successfully");
      setModalOpen(false);
    },
    onError: (error) => {
      console.log(error);

      Alert.alert("Error", error.message);
    },
  });

  // Submit Flow
  const SubmitFlow = async (values: ValueType) => {
    const { name, shortName, jerseyNumber, position } = values;

    setLoading(true);

    try {
      createTeam.mutate({
        name,
        leagueId: leagueId as string,
        captainId,
        logoUrl: "",
        shortName,
        jerseyNumber,
        position,
      });
    } catch (error: any) {
      console.log("Error @Create-Team.SubmitFlow: ", error);
    } finally {
      setLoading(false);
    }
  };

  if (!leagueId) return null;
  return (
    <View className="flex flex-1 w-full p-3 gap-2">
      {/* Team Name */}
      <AuthInput
        config={{
          placeholder: "Team Name",
          textContentType: "name",
          keyboardType: "default",
        }}
        control={control}
        name="name"
      />

      {/* Team Short Name */}
      <AuthInput
        config={{
          placeholder: "Short Name",
          textContentType: "name",
          keyboardType: "default",
          maxLength: 3,
        }}
        control={control}
        name="shortName"
        iconsHidden={true}
      />

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

      <View>
        {/* Submit */}
        {loading && <Loading />}
        {!loading && (
          <AuthButton
            onPress={handleSubmit(SubmitFlow)}
            label="Create Team"
            disabled={!(isDirty && isValid)}
          />
        )}
      </View>
    </View>
  );
};

export default CreateTeam;
