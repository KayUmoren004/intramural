import { User } from "@/lib/types/entities";
import { Feather } from "@expo/vector-icons";
import { Modal, View, Text, Pressable } from "react-native";

type UpdateSettingsModalProps = {
  isOpen: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  onAvatarChange?: (avatar: any) => void;
  title: string;
  user: User;
};

export const UpdateSettingsModal = ({
  isOpen,
  onClose,
  onAvatarChange,
  title,
  user,
}: UpdateSettingsModalProps) => {
  return (
    <Modal
      animationType="slide"
      visible={isOpen}
      onRequestClose={() => onClose(false)}
      presentationStyle="formSheet"
    >
      <View className="flex flex-col flex-1 justify-start items-start bg-background-light dark:bg-background-dark gap-4">
        {/* Header */}
        <View className="h-16 w-full items-center justify-between flex-row p-2 border-b border-neutral-500">
          <Text className="text-text-light dark:text-text-dark text-3xl font-bold">
            {title}
          </Text>
          <Pressable onPress={() => onClose(false)}>
            <Feather name="x" size={24} color="red" />
          </Pressable>
        </View>

        {/* Body */}
      </View>
    </Modal>
  );
};
