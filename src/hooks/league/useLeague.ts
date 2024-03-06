import { useQuery, useMutation } from "@tanstack/react-query";
import { league } from "./league.requests";
import type { NewLeague, UpdateLeague } from "./league.requests";
import { LeagueSettings } from "../../lib/types/entities";

// Update League type
export type UpdateParams = {
  prevLeague: UpdateLeague;
  sportId: string;
  leagueId: string;
};

// Get all Leagues
export const useGetLeagues = (sportId: string) => {
  return useQuery({
    queryKey: ["leagues", sportId],
    queryFn: () => league.getLeagues(sportId),
  });
};

// Get all Leagues for a School
export const useGetSchoolLeagues = (schoolId: string) => {
  return useQuery({
    queryKey: ["schoolLeagues", schoolId],
    queryFn: () => league.getSchoolLeagues(schoolId),
  });
};

// Get a League
export const useGetLeague = (sportId: string, leagueId: string) => {
  return useQuery({
    queryKey: ["league", sportId, leagueId],
    queryFn: () => league.getLeague(sportId, leagueId),
  });
};

// Create a League
export const useCreateLeague = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: any, variables: any, context: any) => void;
  onError?: (error: any, variables: any, context: any) => void;
}) => {
  return useMutation({
    mutationFn: (newLeague: NewLeague) => league.createLeague(newLeague),
    onSuccess,
    onError,
  });
};

// Delete a League
export const useDeleteLeague = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: any, variables: any, context: any) => void;
  onError?: (error: any, variables: any, context: any) => void;
}) => {
  return useMutation({
    mutationFn: (body: { leagueId: string; sportId: string }) =>
      league.deleteLeague(body.leagueId, body.sportId),
    onSuccess,
    onError,
  });
};

// Update a League
export const useUpdateLeague = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: any, variables: any, context: any) => void;
  onError?: (error: any, variables: any, context: any) => void;
}) => {
  return useMutation({
    mutationFn: ({ prevLeague, sportId, leagueId }: UpdateParams) =>
      league.updateLeague(prevLeague, sportId, leagueId),
    onSuccess,
    onError,
  });
};

export type UpdateLeagueSettingsParams = {
  prevSettings: LeagueSettings[];
  leagueId: string;
  sportId: string;
};

// Update a League's Settings
export const useUpdateLeagueSettings = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: any, variables: any, context: any) => void;
  onError?: (error: any, variables: any, context: any) => void;
}) => {
  return useMutation({
    mutationFn: ({
      prevSettings,
      leagueId,
      sportId,
    }: UpdateLeagueSettingsParams) =>
      league.updateLeagueSettings(prevSettings, leagueId, sportId),
    onSuccess,
    onError,
  });
};
