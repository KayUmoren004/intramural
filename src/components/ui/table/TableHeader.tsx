import { Text, View } from "react-native";
import type { sportheaders } from "../../../lib/types/headers";

type TableHeaderProps = {
  header: sportheaders[];
};

const TableHeader = ({ header }: TableHeaderProps) => {
  //   console.log(header);

  // Extract shorthands from header
  const shorthands = header.map(
    (item) => !item.main && item.name !== "Form" && item.shorthand
  );
  const main = header.map((item) => item.main && item.shorthand);

  //   console.log(shorthands);

  return (
    // <View className=" flex flex-row items-start justify-between w-full bg-primary-light py-4">
    <View className="flex flex-row w-full items-start">
      <View className="flex flex-row items-start justify-between w-1/2">
        {main.map((main, idx) => (
          <Text
            key={idx}
            className="text-text-light dark:text-text-dark font-semibold"
          >
            {main}
          </Text>
        ))}
      </View>
      <View className="flex flex-row items-start justify-between w-1/2">
        {shorthands.map((shorthand, idx) => (
          <Text
            key={idx}
            className="text-text-light dark:text-text-dark font-semibold w-full text-center"
          >
            {shorthand}
          </Text>
        ))}
      </View>
    </View>
  );
};

export default TableHeader;
