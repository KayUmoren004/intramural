import { Sport } from "@/lib/types/entities";
import { Link, useGlobalSearchParams, useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import Text from "../ui/Text";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

type SchoolListProps = {
  sport: Sport;
};

const SchoolList = ({ sport }: SchoolListProps) => {
  const { school } = useGlobalSearchParams();
  const { push } = useRouter();

  if (!sport) return null;

  return (
    <TouchableOpacity
      onPress={() =>
        push(`/${school}/(tabs)/(school)/sport/${sport.name}/${sport.id}`)
      }
      disabled={sport.status === "Inactive" || sport.status === "Canceled"}
      className={cn(
        "flex flex-1 items-start justify bg-background-light dark:bg-background-dark w-full py-4 px-2 rounded mb-1.5 border border-neutral-500",
        sport.status === "Inactive" || sport.status === "Canceled"
          ? "opacity-50"
          : ""
      )}
    >
      <View className="flex flex-row items-center justify-between w-full">
        <View className="flex-row justify-between items-center">
          <MaterialIcons
            name="sports-basketball"
            size={30}
            color="#fff"
            className="mr-2"
          />
          <Text>{sport.name}</Text>
          <Dot status={sport.status} />
        </View>
        {/* <Text>{sport.leagues.length.toString() ?? 0}</Text> */}
        <Badge variant="outline">
          <Text>{sport.season}</Text>
        </Badge>
      </View>
    </TouchableOpacity>
  );
};

const dotStyles: { [key: string]: string } = {
  Active: "bg-green-500 rounded-full h-3 w-3 ml-2",
  Inactive: "bg-red-500 rounded-full h-3 w-3 ml-2",
  Canceled: "bg-red-500 rounded-full h-3 w-3 ml-2",
};

const Dot = ({ status }: { status: Sport["status"] }) => {
  const style = dotStyles[status];

  return <View className={style} />;
};

export default SchoolList;
