import {
  router,
  useGlobalSearchParams,
  useLocalSearchParams,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Appearance,
  useColorScheme,
  Button,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import * as FileSystem from "expo-file-system";
import { useEffect, useState } from "react";
import { Image, ImageErrorEventData } from "expo-image";
import CachedImage from "expo-cached-image";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSession } from "@/lib/providers/auth-provider";
import useColor from "@/lib/colors/useColors";
import { League, PlayerStats, Team, User } from "@/lib/types/entities";
import Information from "@/components/profile/Information";

// Check if local image exists on device, if not, return false
const localImageExists = async (local: string) => {
  const result = await FileSystem.getInfoAsync(local);
  if (result.exists) {
    return true;
  } else {
    return false;
  }
};

export default function App() {
  const { school } = useGlobalSearchParams();
  const { session } = useSession();
  console.log(session);

  const Colors = useColor();
  const userData: User | undefined = session?.user;

  // const { image } = userData;
  // const { local, url } = image;

  const IMG_HEIGHT = Dimensions.get("window").height * 0.17;
  const SCREEN_WIDTH = Dimensions.get("window").width;
  const PROFILE_IMAGE_SIZE = 100; // Assuming this is the size of your profile image
  const centerProfileImage = (SCREEN_WIDTH - PROFILE_IMAGE_SIZE) / 2;
  const PROFILE_IMAGE_OFFSET = IMG_HEIGHT - 50; // Adjust this as needed

  const insets = useSafeAreaInsets();

  return (
    <View className="flex flex-1 items-center justify-between bg-background-light dark:bg-background-dark">
      <View style={{ width: "100%", flex: 1 }}>
        {/* Cover Image and Settings */}
        <View style={{ width: "100%", height: IMG_HEIGHT }}>
          <CachedImage
            source={{ uri: userData?.bio ?? "", expiresIn: 2_628_288 }}
            cacheKey={`${userData?.uid}-profile-cover`}
            placeholderContent={
              <Image
                style={{ width: "100%", height: IMG_HEIGHT }}
                onError={(e) => console.log(e)}
                placeholder={userData?.image_blurhash}
                cachePolicy="disk"
              />
            }
            resizeMode="cover"
            style={{ width: "100%", height: IMG_HEIGHT }}
          />
          <View
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              marginTop: insets.top - 15,
              marginRight: 15,
              backgroundColor: "rgba(0,0,0,0.5)",
              borderRadius: 50,
              padding: 10,
            }}
          >
            <TouchableOpacity onPress={() => console.log("Settings")}>
              <Feather name="settings" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        {/* Profile Image and User Data */}
        <View style={{ alignItems: "center", flex: 1 }}>
          {/* Profile Image */}
          <View
            style={{
              backgroundColor: Colors.BACKGROUND,
              borderRadius: 100,
              padding: 4,
              top: -PROFILE_IMAGE_OFFSET / 2,
              marginBottom: -PROFILE_IMAGE_OFFSET / 2,
            }}
          >
            <CachedImage
              source={{ uri: userData?.bio ?? "", expiresIn: 2_628_288 }}
              cacheKey={`${userData?.id}-profile-main`}
              placeholderContent={
                <Image
                  style={{ width: 100, height: 100 }}
                  onError={(e) => console.log(e)}
                  placeholder={userData?.image_blurhash}
                  cachePolicy="disk"
                />
              }
              resizeMode="cover"
              style={{ width: 100, height: 100, borderRadius: 64 }}
            />
          </View>

          {/* User Data View */}
          <View className="w-full flex flex-1">
            {/* Name and Bio */}
            <View className="flex flex-col items-center justify-center mb-2">
              <View
                style={{
                  marginBottom: 10,
                }}
              >
                <Text className="text-text-light dark:text-text-dark text-3xl text-center font-bold">
                  {userData?.name ?? "User"}
                </Text>
                <Text
                  style={{
                    opacity: 0.5,
                  }}
                  className="text-text-light dark:text-text-dark text-sm text-center"
                >
                  {userData?.bio ?? "Bio"}
                </Text>
              </View>

              {/* School */}
              <View className="flex flex-row items-center justify-center w-full mt-5">
                <View className="flex flex-row items-center justify-center">
                  <Ionicons
                    name="school-outline"
                    size={16}
                    color={Colors.TEXT}
                    style={{ marginRight: 8 }}
                  />
                  <Text className="text-text-light dark:text-text-dark text-sm text-center uppercase">
                    {school?.toString().toUpperCase() ?? "School"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Body */}
            <View className="flex flex-1">
              <ScrollView
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                className=""
              >
                {/* Current Season Information */}
                <View className="">
                  <Information
                    type="currentSeason"
                    title="Current Season"
                    data={currentSeason}
                  />
                </View>

                {/* PlayerStats */}
                <View>
                  <Information
                    type="playerStats"
                    title="Player Stats"
                    data={currentSeason}
                  />
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </View>

      {/* <Button title="Logout" onPress={() => signOut()} /> */}
    </View>
  );
}

const currentSeason: {
  season: string;
  teams: Team[];
  leagues: League[];
  playerStats: PlayerStats;
} = {
  season: "Fall 2023",
  teams: [
    {
      id: "1",
      leagueId: "1",
      name: "KFC",
      captain: { name: "Godson Umoren" },
      logoUrl: "https://picsum.photos/200/200",
      wins: 5,
      losses: 0,
      ties: 0,
    },
    {
      id: "2",
      leagueId: "2",
      name: "Basket Tweens",
      captain: { name: "Gavin Meador" },
      logoUrl: "https://picsum.photos/200/200",
      wins: 3,
      losses: 2,
      ties: 0,
    },
    {
      id: "3",
      leagueId: "3",
      name: "The Ballers",
      captain: { name: "Ethan Meador" },
      logoUrl: "https://picsum.photos/200/200",
      wins: 2,
      losses: 3,
      ties: 0,
    },
  ],
  leagues: [
    {
      id: "1",
      sportId: "1",
      name: "Soccer",
      startDate: new Date("2023-09-01"),
      endDate: new Date("2023-11-01"),
    },
    {
      id: "2",
      sportId: "2",
      name: "Basketball",
      startDate: new Date("2023-09-01"),
      endDate: new Date("2023-11-01"),
    },
    {
      id: "3",
      sportId: "3",
      name: "Volleyball",
      startDate: new Date("2023-09-01"),
      endDate: new Date("2023-11-01"),
    },
  ],
  playerStats: {
    playerId: "randomID",
    stats: [
      {
        sportId: "1",
        leagueId: "1",
        teamId: "1",
        gamesPlayed: 5,
        goals: 3,
        assists: 2,
        yellowCards: 0,
        redCards: 0,
      },
      {
        sportId: "2",
        leagueId: "2",
        teamId: "2",
        gamesPlayed: 7,
        points: 10,
        rebounds: 5,
        assists: 2,
        steals: 1,
        blocks: 0,
        turnovers: 2,
        fouls: 0,
      },
      {
        sportId: "3",
        leagueId: "3",
        teamId: "3",
        gamesPlayed: 3,
        blocks: 5,
        kills: 10,
        assists: 2,
        ace: 1,
        digs: 0,
        errors: 2,
      },
    ],
  },
};
