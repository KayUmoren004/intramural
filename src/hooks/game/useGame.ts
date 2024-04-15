import { useQuery, useMutation } from "@tanstack/react-query";
import { game, type GameAttendanceBody } from "./game.requests";

// Get Game
export const useGetGame = (gameId: string) => {
  return useQuery({
    queryKey: ["game", gameId],
    queryFn: () => game.getGame(gameId),
  });
};

// Add Attendance
export const useAddAttendance = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: any, variables: any, context: any) => void;
  onError?: (error: any, variables: any, context: any) => void;
}) => {
  return useMutation({
    mutationFn: (body: GameAttendanceBody) => game.addAttendance(body),
    onSuccess,
    onError,
  });
};
