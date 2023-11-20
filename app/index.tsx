import { useLocalSearchParams, useRootNavigationState } from "expo-router";
import { useRouter, useSegments } from "expo-router";
import {
  AuthStore,
  StoreType,
  getCurrentUser,
  getSchoolList,
  getUserData,
} from "../store";
import React, { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { createAsyncAction, errorResult, successResult } from "pullstate";
import useColor from "../src/lib/colors/useColors";

const Index = () => {
  const segments = useSegments();
  const router = useRouter();

  const navigationState = useRootNavigationState();

  const { initialized, isLoggedIn, slug, user } = AuthStore.useState();

  const Colors = useColor();

  React.useEffect(() => {
    if (!navigationState?.key || !initialized) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (
      // If the user is not signed in and the initial segment is not anything
      //  segment is not anything in the auth group.
      !isLoggedIn &&
      !inAuthGroup
    ) {
      // Redirect to the login page.
      router.replace("/login");
    } else if (isLoggedIn) {
      // go to tabs root.
      // router.replace("/(tabs)/home");
      router.replace(`/(protected)/${slug}/dashboard`);
    }
  }, [segments, navigationState?.key, initialized]);

  return (
    <View className="flex-1 items-center justify-center bg-background-light dark:bg-background-dark">
      {!navigationState?.key ? (
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      ) : (
        <></>
      )}
    </View>
  );
};
export default Index;
