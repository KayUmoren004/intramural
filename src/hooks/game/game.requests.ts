import { requests } from "@/config/agent";
import { Game } from "@/lib/types/entities";

type AttendanceType = {
  teamId: string;
  players: string[];
};

export type GameAttendanceBody = {
  gameId: string;
  attendance: AttendanceType[];
};

export const game = {
  getGame: (gameId: string): Promise<Game> =>
    requests.get<any>(`/game/${gameId}`),
  addAttendance: (body: GameAttendanceBody): Promise<Game> =>
    requests.post<any>(`/game/attendance`, body),
};
