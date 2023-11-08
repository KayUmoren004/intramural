import {
  Tabs,
  useLocalSearchParams,
  usePathname,
  useRouter,
} from "expo-router";

import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import useColor from "../../../../src/lib/colors/useColors";
import { Feather } from "@expo/vector-icons";

const Layout = () => {
  const Colors = useColor();

  const screenOptions: BottomTabNavigationOptions = {
    headerShown: false,
    tabBarStyle: {
      backgroundColor: Colors.BACKGROUND,
      borderTopColor: Colors.TEXT,
      zIndex: 50,
    },
    tabBarShowLabel: false,
    tabBarActiveTintColor: Colors.PRIMARY,
    tabBarInactiveTintColor: Colors.DISABLED,
  };

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return <Feather name="home" size={size} color={color} />;
          },
        }}
        name="dashboard/index"
      />
      <Tabs.Screen
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return <Feather name="map-pin" size={size} color={color} />;
          },
        }}
        name="school/index"
      />
      <Tabs.Screen
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return <Feather name="bell" size={size} color={color} />;
          },
          tabBarBadge: 3, // TODO: Get notifications count
        }}
        name="notifications/index"
      />
      <Tabs.Screen
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return <Feather name="user" size={size} color={color} />;
          },
        }}
        name="profile/index"
      />
    </Tabs>
  );
};

export default Layout;
