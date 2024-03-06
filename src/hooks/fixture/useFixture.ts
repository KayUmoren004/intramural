import { useQuery } from "@tanstack/react-query";
import { fixture } from "./fixture.request";

// Get All Fixtures in a League
export const useGetLeagueFixtures = (leagueId: string) => {
  return useQuery({
    queryKey: ["leagueFixtures", leagueId],
    queryFn: () => fixture.getLeagueFixtures(leagueId),
  });
};
