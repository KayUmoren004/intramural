import type { Sport, SportSettings } from "../../lib/types/entities";
import { requests } from "../../config/agent";

export type NewSport = Omit<Sport, "id" | "leagues" | "status">;
export type UpdateSport = Partial<Sport>;
export type UpdateSportSettings = SportSettings[];

export const sport = {
  createSport: (sport: NewSport): Promise<Sport> =>
    requests.post<any>("/sport/create", sport),
  getSports: (schoolId: string): Promise<Sport[]> =>
    requests.get<any>(`/sport/${schoolId}`),
  getSport: (schoolId: string, sportId: string): Promise<Sport> =>
    requests.get<any>(`/sport/${schoolId}/${sportId}`),
  deleteSport: (sportId: string, schoolId: string): Promise<void> =>
    requests.del<any>(`/sport/delete/${schoolId}/${sportId}`),
  updateSport: (
    sport: UpdateSport,
    schoolId: string,
    sportId: string
  ): Promise<Sport> =>
    requests.patch<any>(`/sport/update/${schoolId}/${sportId}`, sport),
  updateSportSettings: (
    sport: SportSettings[],
    schoolId: string,
    sportId: string
  ): Promise<Sport> => {
    return requests.patch<any>(
      `/sport/update/${schoolId}/${sportId}/settings`,
      sport
    );
  },
};
