import { requests } from "../../config/agent";
import { Team } from "../../lib/types/entities";

export type NewTeam = Omit<
  Team,
  | "id"
  | "wins"
  | "losses"
  | "ties"
  | "captain"
  | "players"
  | "league"
  | "sport"
  | "attendance"
> & {
  jerseyNumber: string;
  position: string;
};
export type UpdateTeam = Partial<Team>;

export const team = {
  createTeam: (team: any): Promise<Team> =>
    requests.post<any>("/team/create", team),
  getTeams: (leagueId: string): Promise<Team[]> =>
    requests.get<any>(`/team/${leagueId}`),
  getTeam: (leagueId: string, teamId: string): Promise<Team> =>
    requests.get<any>(`/team/${leagueId}/${teamId}`),
  getSchoolTeams: (schoolId: string): Promise<Team[]> =>
    requests.get<any>(`/team/school/${schoolId}`),
  deleteTeam: (teamId: string, leagueId: string): Promise<void> =>
    requests.del<any>(`/team/delete/${leagueId}/${teamId}`),
  updateTeam: (team: any, leagueId: string, teamId: string): Promise<Team> =>
    requests.patch<any>(`/team/update/${leagueId}/${teamId}`, team),
  joinTeam: (body: any): Promise<Team> =>
    requests.post<any>(
      `/team/join/${body.leagueId}/${body.teamId}/${body.userId}`,
      body
    ),
};
