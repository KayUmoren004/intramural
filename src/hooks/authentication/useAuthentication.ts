import { useQuery, useMutation } from "@tanstack/react-query";
import * as FileSystem from "expo-file-system";

import type {
  JWT,
  LoginResponse,
  Login,
  Register,
  Session,
} from "./authentication";
import { authentication } from "./authentication";

// Login
export const useLogin = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: LoginResponse, variables: any, context: any) => void;
  onError?: (error: any, variables: any, context: any) => void;
}) => {
  return useMutation({
    mutationFn: (body: Login) => authentication.login(body),
    onSuccess,
    onError,
  });
};

// Sign Up
export const useRegister = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: any, variables: any, context: any) => void;
  onError?: (error: any, variables: any, context: any) => void;
}) => {
  return useMutation({
    mutationFn: (body: Register) => authentication.register(body),
    onSuccess,
    onError,
  });
};

// Refresh Token
export const useRefreshToken = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: any, variables: any, context: any) => void;
  onError?: (error: any, variables: any, context: any) => void;
}) => {
  return useMutation({
    mutationFn: (token: JWT) => authentication.refreshToken(token),
    onSuccess,
    onError,
  });
};

// Get School List
export const useGetSchoolList = () => {
  return useQuery({
    queryKey: ["schoolList"],
    queryFn: () => authentication.getSchoolList(),
  });
};
