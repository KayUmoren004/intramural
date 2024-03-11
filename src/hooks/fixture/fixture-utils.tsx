import { FixtureType } from "@/components/games/fixtures/fixture-items";
import { Fixture } from "@/lib/types/entities";
import { fixture } from "./fixture.request";
import { format } from "date-fns";

// [
//   {
//     id: "68c80fff-a2e2-44f6-a6fb-bd3ba35e290e",
//     resultsId: null,
//     homeFixtureId: "a1ba564d-348f-4d03-8957-1ad51ec9d31e",
//     awayFixtureId: "593c22bc-70b0-484f-8eef-289503f21453",
//     date: "2024-03-06T17:04:46.267Z",
//     leagueId: "a2d40ccb-5366-465e-ae24-b3eae7bacad8",
//     homeTeam: {
//       id: "a1ba564d-348f-4d03-8957-1ad51ec9d31e",
//       logo: "team.com/logo",
//       name: "Burton's Army",
//       homeTeamId: "05dccfe0-9737-46c9-9eba-5aa22bc36c96",
//       type: "Home",
//     },
//     awayTeam: {
//       id: "593c22bc-70b0-484f-8eef-289503f21453",
//       logo: "team.com/logo",
//       name: "Zac's U17",
//       awayTeamId: "db12ee24-63a7-425a-9744-96d4be04abb7",
//       type: "Away",
//     },
//     results: null,
//   },
// ];

// Build Fixture
export const buildFixture = (data: Fixture) => {
  const homeTeam = data.homeTeam;
  const awayTeam = data.awayTeam;
  const date = data.date;
  const time = data.date;
  const id = data.id;
  const results = data.results ?? null;

  const val: FixtureType = {
    homeTeam,
    awayTeam,
    date: format(new Date(date), "PPP"),
    time: format(new Date(time), "hh:mm a"),
    id,
    isoDate: date,
    result:
      {
        homeScore: results?.homeScore ?? 0,
        awayScore: results?.awayScore ?? 0,
        winner: results?.winner ?? "Draw",
      } ?? null,
  };

  return val;
};

// Build Fixtures
export const buildFixtures = (data: Fixture[]) => {
  const fixtures: FixtureType[] = data.map((fixture) => {
    return buildFixture(fixture);
  });

  return fixtures;
};

// Build Fixtures based on captain Id
export const buildCaptainFixture = (data: Fixture[], captainId: string) => {
  if (!captainId || !data) return null;

  const fixtures = data
    .filter((fixture) => {
      return (
        fixture.homeTeam?.team?.captainId === captainId ||
        fixture.awayTeam?.team?.captainId === captainId
      );
    })
    .map((fixture) => {
      return buildFixture(fixture);
    });

  return fixtures;
};

// Build Fixtures based on team Id
export const buildTeamFixture = (data: Fixture[], teamId: string) => {
  const fixtures: FixtureType[] = data
    .filter((fixture) => {
      return (
        fixture.homeTeam.homeTeamId === teamId ||
        fixture.awayTeam.awayTeamId === teamId
      );
    })
    .map((fixture) => {
      return buildFixture(fixture);
    });

  return fixtures;
};
