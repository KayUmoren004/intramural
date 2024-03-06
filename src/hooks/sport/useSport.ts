import type {
  NewSport,
  UpdateSport,
  UpdateSportSettings,
} from "../sport/sport.requests";
import { sport } from "../sport/sport.requests";
import type { SportSettings } from "../../lib/types/entities";

import { useQuery, useMutation } from "@tanstack/react-query";

// Update Sport Type
export type UpdateParams = {
  prevSport: UpdateSport;
  schoolId: string;
  sportId: string;
};

// Update Sport Settings Type
export type UpdateSportSettingsParams = {
  prevSettings: SportSettings[];
  schoolId: string;
  sportId: string;
};

// Get all Sports
export const useGetSports = (schoolId: string) => {
  return useQuery({
    queryKey: ["sports", schoolId],
    queryFn: () => sport.getSports(schoolId),
  });
};

// Get a Sport
export const useGetSport = (schoolId: string, sportId: string) => {
  return useQuery({
    queryKey: ["sport", schoolId, sportId],
    queryFn: () => sport.getSport(schoolId, sportId),
  });
};

// Create a Sport
export const useCreateSport = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: any, variables: any, context: any) => void;
  onError?: (error: any, variables: any, context: any) => void;
}) => {
  return useMutation({
    mutationFn: (newSport: NewSport) => sport.createSport(newSport),
    onSuccess,
    onError,
  });
};

// Delete a Sport
export const useDeleteSport = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: any, variables: any, context: any) => void;
  onError?: (error: any, variables: any, context: any) => void;
}) => {
  return useMutation({
    mutationFn: (body: { sportId: string; schoolId: string }) =>
      sport.deleteSport(body.sportId, body.schoolId),
    onSuccess,
    onError,
  });
};

// Update a Sport
export const useUpdateSport = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: any, variables: any, context: any) => void;
  onError?: (error: any, variables: any, context: any) => void;
}) => {
  return useMutation({
    mutationFn: ({ prevSport, schoolId, sportId }: UpdateParams) =>
      sport.updateSport(prevSport, schoolId, sportId),
    onSuccess,
    onError,
  });
};

// Update a Sport's Settings
export const useUpdateSportSettings = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: any, variables: any, context: any) => void;
  onError?: (error: any, variables: any, context: any) => void;
}) => {
  return useMutation({
    mutationFn: ({
      prevSettings,
      schoolId,
      sportId,
    }: UpdateSportSettingsParams) =>
      sport.updateSportSettings(prevSettings, schoolId, sportId),
    onSuccess,
    onError,
  });
};
