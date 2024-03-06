import { requests } from "../../config/agent";
import type { Fixture } from "@/lib/types/entities";

export type NewFixture = {
  homeId: string;
  awayId: string;
  date: string;
};

export const fixture = {
  createFixture: (fixture: NewFixture): Promise<Fixture> =>
    requests.post<any>("/fixture/create", fixture),
  getFixture: (fixtureId: string): Promise<Fixture> =>
    requests.get<Fixture>(`/fixture/${fixtureId}`),
  getLeagueFixtures: (leagueId: string): Promise<Fixture[]> =>
    requests.get<Fixture[]>(`/fixture/league/${leagueId}`),
};
