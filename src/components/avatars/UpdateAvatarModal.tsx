import useColor from "@/lib/colors/useColors";
import { Feather } from "@expo/vector-icons";
import { Stack } from "expo-router";
import {
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Image } from "expo-image";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUploadImage } from "@/hooks/user/useUser";
import { BACKEND_URL } from "@/config/constants";
import { useSession } from "@/lib/providers/auth-provider";
import Loading from "../ui/Loading";
import { User } from "@/lib/types/entities";
import { useQueryClient } from "@tanstack/react-query";

type UpdateAvatarModalProps = {
  isOpen: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  onAvatarChange: (avatar: any) => void;
  title: string;
  userId: string;
};

type ResponseData = {
  blurhash: string;
  photoUrl: string | null;
};

export const UpdateAvatarModal = ({
  isOpen,
  onClose,
  onAvatarChange,
  title,
  userId,
}: UpdateAvatarModalProps) => {
  const { ERROR } = useColor();
  const queryClient = useQueryClient();
  const [photo, setPhoto] = useState<any>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [responseData, setResponseData] = useState<ResponseData | null>(null);

  const { bottom } = useSafeAreaInsets();

  const { session } = useSession();
  const user = session?.user as User;
  const avatarUrl = user?.avatarUrl;

  // Token
  const token = session?.backendToken.accessToken;

  const getPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      return status;
    }
  };

  // Get Camera Permission
  const getCameraPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      return status;
    }
  };

  // Pick Image
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0,
      });

      console.log(result);

      if (!result.canceled && result.assets) {
        setPhoto(result.assets[0]);
      }

      return result.assets ? result.assets[0] : null;
    } catch (error) {
      console.log("Error @Photo Modal: ", error);
    }
  };

  // Capture Image
  const captureImage = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],

        quality: 0,
      });

      console.log(result);

      if (!result.canceled && result.assets) {
        setPhoto(result.assets[0]);
      }

      return result.assets ? result.assets[0] : null;
    } catch (error) {
      console.log("Error @Photo Modal: ", error);
    }
  };

  const addProfilePhoto = async (mode: "cam" | "lib") => {
    const status =
      mode === "cam" ? await getCameraPermission() : await getPermission();

    if (status !== "granted") {
      alert("We need permission to access your camera roll.");

      return;
    }

    // Image
    const image = mode === "cam" ? await captureImage() : await pickImage();

    if (!image) {
      return;
    }

    setLoading(true);
    try {
      const response = await FileSystem.uploadAsync(
        `${BACKEND_URL}/user/${userId}/photo`,
        image.uri,
        {
          fieldName: "photo",
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response: ", response);

      if (response.status !== 201) {
        const data = await JSON.parse(response.body);
        console.log("Error: ", data);
        throw new Error(data.message);
      } else {
        const data = await JSON.parse(response.body);
        console.log("Data: ", data);
        setResponseData(data);
        queryClient.invalidateQueries();
        await Image.clearDiskCache();
        await Image.clearMemoryCache();
      }
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setLoading(false);
    }

    onAvatarChange({
      uri: image.uri,
      blurhash: responseData?.blurhash,
    });

    // close the modal
    onClose(false);
  };

  const choices = [
    {
      title: "Choose from library",
      icon: "image",
      onPress: () => addProfilePhoto("lib"),
    },
    {
      title: "Take a photo",
      icon: "camera",
      onPress: () => addProfilePhoto("cam"),
    },
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={() => onClose(false)}
    >
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={1}
        onPressOut={() => onClose(false)}
      >
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.4)",
            flex: 1,
          }}
          className="flex-1 items-start justify-end w-full bg-red-200"
        >
          {loading && (
            <View className="w-full mb-[200px]">
              <Loading />
            </View>
          )}

          {/* Actual Modal */}
          <View
            className="w-full h-[250px] bg-neutral-100 dark:bg-neutral-800 px-4 rounded-2xl gap-4"
            style={{
              paddingBottom: bottom,
            }}
          >
            {/* Top */}
            <View className="border-b border-white dark:border-white py-4 items-center justify-center">
              <View className="h-14 w-14 rounded-full">
                <Image
                  source={{
                    uri: avatarUrl ?? photo.uri ?? responseData?.photoUrl,
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 100,
                  }}
                  cachePolicy="memory-disk"
                  contentFit="fill"
                  contentPosition="center"
                  onError={(e) => console.log("Error (update modal): ", e)}
                  placeholder={user?.blurhash ?? responseData?.blurhash}
                />
              </View>
            </View>

            {/* Bottom */}
            <View className="gap-4">
              {choices.map((choice, index) => (
                <Choice key={index} loading={loading} {...choice} />
              ))}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const Choice = ({
  title,
  onPress,
  icon,
  loading,
}: {
  title: string;
  onPress: () => void;
  icon: any;
  loading: boolean;
}) => {
  const { TEXT } = useColor();
  return (
    <Pressable
      disabled={loading}
      onPress={onPress}
      className="flex-row items-center justify-start w-full gap-4"
    >
      <Feather name={icon} size={24} color={TEXT} />
      <Text className="text-text-light dark:text-text-dark">{title}</Text>
    </Pressable>
  );
};
