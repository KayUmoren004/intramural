import type { GeneralModal } from "@/lib/types/UI";
import { Modal, SectionList, Text, View } from "react-native";
import { Header } from "./components/header";
import {
  buildFixtures,
  sortFixturesByDate,
} from "@/hooks/fixture/fixture-utils";
import { cn } from "@/lib/utils";
import { Fixture, FixtureType } from "../games/fixtures/fixture-items";

function sortArrayByDate(array: any) {
  return array.sort((a: any, b: any) => {
    // Convert date strings to Date objects
    const dateA = new Date(a.isoDate).getTime();
    const dateB = new Date(b.isoDate).getTime();

    // Compare the dates
    return dateA - dateB;
  });
}

export const FixturesModal = ({
  isOpen,
  onClose,
  onChange,
  title,
  fixtures,
}: GeneralModal) => {
  // Sort Fixtures
  const sortedFixtures = buildFixtures(fixtures);
  const f = sortArrayByDate(sortedFixtures);

  // console.log("Sorted Fixtures", sortedFixtures);

  // Sort Fixtures by Date
  const fixtureBins = sortFixturesByDate(f);

  const isLastFixture = (fixture: FixtureType) => {
    const lastFixture = sortedFixtures[sortedFixtures.length - 1];

    return lastFixture.id === fixture.id;
  };

  return (
    <Modal
      animationType="slide"
      visible={isOpen}
      onRequestClose={() => onClose(false)}
      presentationStyle="formSheet"
      className="flex flex-1"
    >
      <View
        className="
      flex flex-1 bg-background-light dark:bg-background-dark w-full"
      >
        <Header title={title} />

        {/* Body */}
        <SectionList
          sections={fixtureBins}
          keyExtractor={(item, index) => item.id + index}
          renderItem={({ item }) => (
            <View
              className={cn(
                "p-2",
                !isLastFixture(item) ? "border-b border-neutral-500" : ""
              )}
            >
              <Fixture {...item} />
            </View>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text className="text-2xl font-bold text-text dark:text-text-dark p-4 w-full bg-background-light dark:bg-background-dark">
              {title}
            </Text>
          )}
          contentContainerClassName=" w-full gap-2 bg-background-light dark:bg-background-dark"
        />
      </View>
    </Modal>
  );
};
