import { useRootNavigationState } from "expo-router";
import { useRouter, useSegments } from "expo-router";
import { AuthStore } from "../store";
import React, { useState } from "react";
import { Text, View } from "react-native";

const Index = () => {

  const segments = useSegments();
  const router = useRouter();

  const navigationState = useRootNavigationState();

  const { initialized, isLoggedIn } = AuthStore.useState();

  console.log("segments", segments);
  console.log("navigationState", navigationState);
  console.log("initialized", initialized);

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
      console.log("not logged in");
    } else if (isLoggedIn) {
      // go to tabs root.
      // router.replace("/(tabs)/home");
      console.log("logged in");
    }
  }, [segments, navigationState?.key, initialized]);

  return <View>{!navigationState?.key ? <Text className="text-text dark:text-text-dark">LOADING...</Text> : <></>}</View>;
};
export default Index;