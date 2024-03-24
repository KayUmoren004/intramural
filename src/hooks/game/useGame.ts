import { useQuery } from "@tanstack/react-query";
import { game } from "./game.requests";

// Get Game
export const useGetGame = (gameId: string) => {
  return useQuery({
    queryKey: ["game", gameId],
    queryFn: () => game.getGame(gameId),
  });
};
