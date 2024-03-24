import { requests } from "@/config/agent";
import { Game } from "@/lib/types/entities";

export const game = {
  getGame: (gameId: string): Promise<Game> =>
    requests.get<any>(`/game/${gameId}`),
};
