import { Pressable, View, Text, StyleSheet } from "react-native";

type TabItem = {
  label: string;
  value: string;
};

type TabProp = {
  selectedTab: string;
  setSelectedTab: (value: string) => void;
  tabList: TabItem[];
};

export const Tab = ({ selectedTab, setSelectedTab, tabList }: TabProp) => {
  return (
    <View
      className="w-full items-center justify-evenly gap-4 bg-primary-light dark:bg-primary-dark p-2 mb-4"
      style={styles.container}
    >
      {tabList.map((tab) => {
        const isActive = tab.value === selectedTab;
        return (
          <Pressable
            key={tab.value}
            onPress={() => setSelectedTab(tab.value)}
            style={[
              styles.tab,
              isActive ? styles.activeTab : styles.inactiveTab,
            ]}
            className="text-center"
          >
            <Text
              style={isActive ? styles.activeTabText : styles.inactiveTabText}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    shadowOpacity: 0.1,
    shadowColor: "black",
    shadowOffset: { height: 0, width: 0 },
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  activeTab: {
    backgroundColor: "white",
  },
  inactiveTab: {},
  activeTabText: {
    color: "black",
    fontWeight: "bold",
  },
  inactiveTabText: {
    color: "grey",
  },
});
