import { League, SoccerTable, Team } from "@/lib/types/entities";

const team = {
  position: 1,
  Team: "FC Awesome",
  stats: {
    GP: 10,
    W: 6,
    T: 2,
    L: 2,
    // "+/-": "20-10",
    GD: 10,
    PTS: 20,
  },
  Form: "W-L-W-W-T",
};

type TeamType = {
  id: string;
  position: string;
  Team: Team;
  teamId: string;
  leagueId: string;
  league: League;
  stats: {
    GP: string;
    W: string;
    T: string;
    L: string;
    GD: string;
    PTS: string;
  };
};

const StatsMap: { [key: string]: string } = {
  played: "GP",
  wins: "W",
  draws: "T",
  loss: "L",
  goalsFor: "GF",
  goalsAgainst: "GA",
  goalDifference: "GD",
  points: "PTS",
  position: "POS",
};

export const getTableHeaders = (data: SoccerTable[]) => {
  const headers = Object.keys(data[0]).reduce((acc, key) => {
    if (StatsMap[key]) {
      return [...acc, StatsMap[key]];
    }

    return acc;
  }, [] as string[]);

  return headers;
};

const keysToSkip = ["position", "goalsFor", "goalsAgainst"];

export const buildTeam = (team: SoccerTable) => {
  const stats = Object.keys(team).reduce((acc, key) => {
    if (StatsMap[key] && !keysToSkip.includes(key)) {
      return {
        ...acc,
        [StatsMap[key]]: team[key as keyof SoccerTable],
      };
    }

    return acc;
  }, {});

  return {
    stats,
    id: team.id,
    position: team.position,
    Team: team.team,
    teamId: team.teamId,
    leagueId: team.leagueId,
    league: team.league,
  } as unknown as TeamType;
};

export const buildTable = (data: SoccerTable[]) => {
  const table: TeamType[] = data.map((team) => {
    return buildTeam(team);
  });

  return table;
};
