import type { GeneralModal } from "@/lib/types/UI";
import { Modal, SectionList, Text, View } from "react-native";
import { Header } from "./components/header";
import {
  buildFixtures,
  sortFixturesByDate,
} from "@/hooks/fixture/fixture-utils";
import { cn } from "@/lib/utils";
import { Fixture, FixtureType } from "../games/fixtures/fixture-items";

export const FixturesModal = ({
  isOpen,
  onClose,
  onChange,
  title,
  fixtures,
}: GeneralModal) => {
  // Sort Fixtures
  const sortedFixtures = buildFixtures(fixtures);

  // Sort Fixtures by Date
  const fixtureBins = sortFixturesByDate(sortedFixtures);

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
      className=""
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
          contentContainerClassName="flex flex-1 w-full gap-2 bg-background-light dark:bg-background-dark"
        />
      </View>
    </Modal>
  );
};
