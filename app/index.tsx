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

// import * as SplashScreen from "expo-splash-screen";

// const getDataAsync = createAsyncAction(async () => {
//   const userData = await getUserData();
//   const schoolList = await getSchoolList();

//   // if (data.error) {
//   //   console.log("Error @Profile.getDataAsync: ", data.error);
//   // } else {
//   //   AuthStore.update((s) => {
//   //     s.userData = data.userData;
//   //   });
//   //   return successResult();
//   // }

//   if (userData.error || schoolList.error) {
//     return errorResult([], "Could not get async data");
//   }

//   if (userData.userData && schoolList.schoolList) {
//     AuthStore.update((s) => {
//       s.userData = userData.userData;
//       s.schoolList = schoolList.schoolList;
//     });
//     return successResult();
//   }

//   return errorResult([], "Could not get user data");
// });

const Index = () => {
  const segments = useSegments();
  const router = useRouter();

  const navigationState = useRootNavigationState();

  const { initialized, isLoggedIn, slug, user } = AuthStore.useState();
  console.log("Slug: ", slug);

  // const [finished, result] = getDataAsync.useBeckon();

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
      console.log("not logged in");
    } else if (isLoggedIn) {
      // go to tabs root.
      // router.replace("/(tabs)/home");
      console.log("logged in");
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
