import { requests } from "../../config/agent";
import type { League, LeagueSettings } from "../../lib/types/entities";

export type NewLeague = Omit<League, "id" | "sport">;
export type UpdateLeague = Partial<League>;

export const league = {
  createLeague: (league: NewLeague): Promise<League> =>
    requests.post<any>("/league/create", league),
  getLeagues: (sportId: string): Promise<League[]> =>
    requests.get<any>(`/league/${sportId}`),
  getSchoolLeagues: (schoolId: string): Promise<League[]> =>
    requests.get<any>(`/league/school/${schoolId}`),
  getLeague: (sportId: string, leagueId: string): Promise<League> =>
    requests.get<any>(`/league/${sportId}/${leagueId}`),
  deleteLeague: (leagueId: string, sportId: string): Promise<void> =>
    requests.del<any>(`/league/delete/${sportId}/${leagueId}`),
  updateLeague: (
    league: UpdateLeague,
    sportId: string,
    leagueId: string
  ): Promise<League> =>
    requests.patch<any>(`/league/update/${sportId}/${leagueId}`, league),
  updateLeagueSettings: (
    league: LeagueSettings[],
    leagueId: string,
    sportId: string
  ): Promise<League> => {
    return requests.patch<any>(
      `/league/update/${sportId}/${leagueId}/settings`,
      league
    );
  },
};
