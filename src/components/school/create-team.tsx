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

type CreateTeamProps = {
  captainId: string;
  leagueId: string | undefined;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type ValueType = {
  name: string;
};

const defaultValues: ValueType = {
  name: "",
};

const CreateTeam = ({ captainId, leagueId, setModalOpen }: CreateTeamProps) => {
  const color = useColor();
  const { createTeamZod } = validateCreateTeam();
  const [loading, setLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();

  // Form
  const {
    control,
    setFocus,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm({
    defaultValues,
    resolver: zodResolver(createTeamZod),
    mode: "onChange",
  });

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
    const { name } = values;

    setLoading(true);

    try {
      createTeam.mutate({
        name,
        leagueId: leagueId as string,
        captainId,
        logoUrl: "",
      });
    } catch (error: any) {
      console.log("Error @Create-Team.SubmitFlow: ", error);
    } finally {
      setLoading(false);
    }
  };

  if (!leagueId) return null;
  return (
    <SafeAreaView className="flex flex-1 items-start justify-between bg-background-light dark:bg-background-dark p-2">
      {/* Header */}
      <View className="p-6 w-full flex flex-row items-start justify-between">
        <Text className="text-text-light dark:text-text-dark font-bold text-2xl">
          Create a Team
        </Text>

        <TouchableOpacity onPress={() => setModalOpen(false)}>
          <Feather name="x" size={24} color={color.ERROR} />
        </TouchableOpacity>
      </View>

      {/* Body */}
      <View className="flex flex-1 w-full p-3 ">
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
        {/* Spacer */}
        <View style={{ height: 10 }} />

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
    </SafeAreaView>
  );
};

export default CreateTeam;
