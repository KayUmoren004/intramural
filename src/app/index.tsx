import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import { Redirect } from "expo-router";
import { useSession } from "@/lib/providers/auth-provider";
import useColor from "@/lib/colors/useColors";

const Index = () => {
  const { session, isLoading } = useSession();

  const colors = useColor();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background-light dark:bg-background-dark">
        <ActivityIndicator size="large" color={colors.PRIMARY} />
      </View>
    );
  }

  if (!isLoading) {
    if (session) {
      const slug = session.user.school.domain.slug;
      return <Redirect href={`/(protected)/${slug}/dashboard`} />;
    } else {
      return <Redirect href="/login" />;
    }
  }

  return (
    <View className="flex-1 items-center justify-center bg-background-light dark:bg-background-dark">
      <Text>You should not be able to see this</Text>
    </View>
  );
};

export default Index;
