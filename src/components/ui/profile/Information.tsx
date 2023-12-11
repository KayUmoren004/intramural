import { Modal, Text, TouchableOpacity, View } from "react-native";
import type { League, PlayerStats, Team } from "../../../lib/types/entities";
import { Link } from "expo-router";
import { useState } from "react";
import SportModal from "./SportModal";
import TeamCard from "./TeamCard";
import StatsModal from "./StatsModal";

type InformationProps = {
  title: string;
  data?: {
    season: string;
    teams: Team[];
    leagues: League[];
    playerStats: PlayerStats;
  };
  type: "currentSeason" | "playerStats";
};

const Information = ({ title, data, type }: InformationProps) => {
  switch (type) {
    case "currentSeason":
      return <CurrentSeason title={title} data={data} />;
    case "playerStats":
      return <PlayerStats title={title} data={data} />;
    default:
      return null;
  }
};

export default Information;

const CurrentSeason = ({
  title,
  data,
}: {
  data: InformationProps["data"];
  title: string;
}) => {
  if (!data) return null;

  // Deconstruct data
  const { season, teams, leagues, playerStats } = data;

  const [modalOpen, setModalOpen] = useState(false);
  const [currentLeague, setCurrentLeague] = useState<any>();

  // Function to open modal
  const openModal = (league: League) => {
    setCurrentLeague(league);
    setModalOpen(true);
  };

  return (
    <View className="flex flex-col justify-between items-start w-full p-2">
      <Text className="text-text-light dark:text-text-dark font-bold text-2xl">
        {season}:
      </Text>
      <View className="w-full">
        {/* Leagues */}
        {leagues.map((league, index) => {
          return (
            <TouchableOpacity
              onPress={() => openModal(league)}
              className="
             w-full border-2 border-primary rounded-md p-3 mb-3 "
              key={index}
            >
              <Text
                className="
              text-text-light dark:text-text-dark font-bold"
              >
                {league.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Modal
        visible={modalOpen}
        onRequestClose={() => {
          setModalOpen(!modalOpen);
        }}
        animationType="slide"
        className=" bg-background dark:bg-background-dark items-start justify-between w-full"
      >
        <SportModal
          league={currentLeague}
          data={data}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
        />
      </Modal>
    </View>
  );
};

const PlayerStats = ({
  data,
  title,
}: {
  data: InformationProps["data"];
  title: string;
}) => {
  if (!data) return null;

  // Deconstruct data
  const { season, teams, leagues, playerStats } = data;

  const [modalOpen, setModalOpen] = useState(false);
  const [currentStats, setCurrentStats] = useState<any>();

  // Function to open modal
  const openModal = (stats: any) => {
    setCurrentStats(stats);
    setModalOpen(true);
  };

  return (
    <View className="flex flex-col justify-between items-start w-full p-2">
      <Text className="text-text-light dark:text-text-dark font-bold text-2xl">
        {title}:
      </Text>

      <View className="w-full">
        {teams.map((team, idx) => (
          <TeamCard
            key={idx}
            team={team}
            season={season}
            league={data.leagues}
            data={data.playerStats}
            onPress={openModal}
          />
        ))}
      </View>

      <Modal
        visible={modalOpen}
        onRequestClose={() => {
          setModalOpen(!modalOpen);
        }}
        animationType="slide"
        className=" bg-background dark:bg-background-dark items-start justify-between w-full"
      >
        <StatsModal
          stats={currentStats}
          data={data}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
        />
      </Modal>
    </View>
  );
};
