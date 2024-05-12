import { Feather } from "@expo/vector-icons";
import { Picker as Select } from "@react-native-picker/picker";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  TextInput,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { PickerItem } from "./PickerItem";
import { Divider } from "@rneui/themed";
import { useState } from "react";
import useColor from "@/lib/colors/useColors";

type items = {
  label: string;
  value: string;
};

type PickerProps = {
  items: items[];
  onValueChange: (itemValue: string, itemLabel: string) => void;
  message?: string;
  searchItem: string;
  close: () => void;
  // setModalShown: React.Dispatch<React.SetStateAction<boolean>>;
  // modalShown: boolean;
};

const Picker = ({
  items,
  onValueChange,
  message,
  searchItem,
  close,
}: // setModalShown,
// modalShown,
PickerProps) => {
  const Colors = useColor();

  // State
  const [search, setSearch] = useState<string>("");
  const [results, setResults] = useState<items[]>(items);

  // Search Function
  const searchItems = (search: string) => {
    setSearch(search);
    const filteredItems = items.filter((item) => {
      return item.label.toLowerCase().includes(search.toLowerCase());
    });
    setResults(filteredItems);
  };

  // Clear Search
  const clearSearch = () => {
    setSearch("");
    setResults(items);
  };

  return (
    <SafeAreaView className="flex-1 justify-between bg-background-light dark:bg-background-dark">
      <View className="flex flex-col items-start">
        {/* Search Bar */}
        <View className="flex flex-row justify-between items-center w-full border-b dark:border-white/20 px-5 py-2.5 h-14">
          <TextInput
            value={search}
            onChangeText={(text) => searchItems(text)}
            placeholder={`Search for ${searchItem}`}
            className="text-text-light dark:text-text-dark text-xl font-light w-[85%]  h-full"
          />
          {search.length > 0 ? (
            <TouchableOpacity onPress={() => clearSearch()}>
              <Text className="text-error-light dark:text-error-dark text-xl font-light">
                Clear
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
        {/* Picker */}
        <View
          style={{
            height: Dimensions.get("screen").height,
            width: Dimensions.get("screen").width,
          }}
          className=""
        >
          <FlashList
            data={results}
            renderItem={({ item }) => (
              <PickerItem
                onPress={() => onValueChange(item.label, item.value)}
                {...item}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => <Divider color={Colors.TEXT} />}
            estimatedItemSize={200}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Picker;
