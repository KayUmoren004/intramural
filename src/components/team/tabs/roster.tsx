import { Player } from "@/lib/types/entities";
import { Text, View, Dimensions } from "react-native";
import { Image } from "expo-image";
import { FlashList } from "@shopify/flash-list";

export const RosterTab = ({
  roster,
  captainId,
}: {
  roster: Player[] | undefined;
  captainId: string;
}) => {
  console.log("Player Roster: ", roster);

  // Get Screen Dimensions
  const { width, height } = Dimensions.get("window");

  if (!roster) return null;

  return (
    <View className="bg-background-light dark:bg-background-dark flex flex-1 p-2 w-full h-full">
      <FlashList
        data={roster}
        keyExtractor={(item) => item.id}
        estimatedItemSize={width}
        renderItem={({ item }) => (
          <RosterItem player={item} captainId={captainId} />
        )}
      />
    </View>
  );
};

const RosterItem = ({
  player,
  captainId,
}: {
  player: Player;
  captainId: string;
}) => {
  const user = player.user;
  const isCaptain = user.id === captainId;

  return (
    <View className="flex flex-row gap-2 items-center justify-between w-full border-b border-neutral-500 py-2">
      <View className="gap-2 flex flex-row items-center justify-center">
        <ItemLogo player={player} />
        <View className="flex flex-col items-start justify-center gap-1 ">
          <Text className="text-text-light dark:text-text-dark font-bold">
            {user.name}
          </Text>
          <Text className="text-neutral-500">
            {isCaptain ? "Captain" : "Member"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const ItemLogo = ({ player }: { player: Player }) => {
  const { user } = player;
  const name = user.name;
  const logoUrl = user.avatarUrl;
  const blurhash = user.blurhash;

  const initials = name
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase();

  if (!logoUrl || logoUrl === "" || logoUrl.length === 0) {
    return (
      <View className="bg-success-light dark:bg-success-dark p-2 h-12 w-12 flex items-center justify-center rounded-full">
        <Text className="text-text-light dark:text-text-dark text-center font-bold text-xl">
          {initials}
        </Text>
      </View>
    );
  }

  return (
    <Image
      style={{ width: 48, height: 48, borderRadius: 64 }}
      onError={(e) => console.log("Error (Roster Image): ", e)}
      placeholder={blurhash}
      cachePolicy="memory-disk"
      source={{ uri: logoUrl }}
      contentFit="fill"
    />
  );
};
