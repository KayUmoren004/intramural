import {
  buildFixtures,
  sortFixturesByDate,
} from "@/hooks/fixture/fixture-utils";
import type { GeneralModal } from "@/lib/types/UI";
import { Modal, SectionList, Text, View } from "react-native";
import { FixtureType } from "../games/fixtures/fixture-items";
import { Header } from "./components/header";
import { cn } from "@/lib/utils";
import { ListResult, Result } from "../games/results/result-items";

export const ResultsModal = ({
  isOpen,
  onClose,
  onChange,
  title,
  results,
}: GeneralModal) => {
  const fixtures = buildFixtures(results);

  // Sort Fixtures by Date
  const fixtureBins = sortFixturesByDate(fixtures);

  const isLastFixture = (fixture: FixtureType) => {
    const lastFixture = fixtures[fixtures.length - 1];

    return lastFixture.id === fixture.id;
  };

  return (
    <Modal
      animationType="slide"
      visible={isOpen}
      onRequestClose={() => onClose(false)}
      presentationStyle="formSheet"
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
              <Result {...item} />
            </View>
          )}
          renderSectionHeader={({ section: { title, data } }) => {
            const dataData = data[0]?.isoDate;
            const hidden =
              new Date(dataData).setHours(0, 0, 0, 0) <
              new Date().setHours(0, 0, 0, 0);
            return (
              <Text
                className={cn(
                  "text-2xl font-bold text-text dark:text-text-dark p-4 w-full bg-background-light dark:bg-background-dark",
                  hidden ? "" : "hidden"
                )}
              >
                {title}
              </Text>
            );
          }}
          contentContainerClassName="flex flex-1 w-full gap-2 bg-background-light dark:bg-background-dark"
        />
      </View>
    </Modal>
  );
};
