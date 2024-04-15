import React, { createContext, useContext, useEffect, useState } from "react";
import { useStorageState } from "../../hooks/useStorageState";
import {
  useLogin,
  useRegister,
} from "../../hooks/authentication/useAuthentication";
import { Alert, View, Text } from "react-native";
import { router, useRouter } from "expo-router";
import {
  JWT,
  Register,
  Session,
} from "../../hooks/authentication/authentication";
import { BACKEND_URL } from "../../config/constants";
import * as SecureStore from "expo-secure-store";
import { useQueryClient } from "@tanstack/react-query";
import { useGetUser } from "@/hooks/user/useUser";
import Loading from "@/components/ui/Loading";
import { Image } from "expo-image";
import { User } from "../types/entities";
import * as FileSystem from "expo-file-system";

export const AuthContext = createContext<{
  signUp: (data: Register) => void;
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  invalidate: () => void;
  session?: Session | null;
  isLoading: boolean;
}>({
  signUp: () => null,
  signIn: () => null,
  signOut: () => null,
  invalidate: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  // return value;

  // Refresh token
  const { session, isLoading } = value;

  return value;
}

// This function can be used to refresh the token.
async function refreshToken(
  refreshToken: string
): Promise<JWT["backendToken"]> {
  console.log("refreshing: ", refreshToken);
  const res = await fetch(BACKEND_URL + "/auth/refresh", {
    method: "POST",
    headers: {
      authorization: `Refresh ${refreshToken}`,
    },
  });
  console.log("Response: ", res);
  console.log("refreshed");

  const response = await res.json();
  console.log(response);

  return response;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const [tokenRefreshed, setTokenRefreshed] = useState(false);
  const [signUpData, setSignUpData] = useState<Register | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const s = session ? JSON.parse(session) : null;
  const userId = s?.user?.id;

  const {
    data: user,
    isLoading: userLoading,
    isError,
    error,
  } = useGetUser(userId ?? "", tokenRefreshed);

  // Return to login
  const Invalidate = async () => {
    setSession(null);
    await SecureStore.deleteItemAsync("session");
    await SecureStore.deleteItemAsync("school");
    router.replace("/login");
  };

  const appSignIn = useLogin({
    onError: (error) => {
      Alert.alert("Login Error", error.message);
    },
    onSuccess: (data) => {
      console.log(data);
      const slug = data?.user?.school?.domain.slug;

      const session: Session = data;

      // Set session
      setSession(JSON.stringify(session));

      // Navigate to dashboard
      router.replace(`/(protected)/${slug}/dashboard`);
    },
  });

  // Sign Up
  const appSignUp = useRegister({
    onError: (error) => {
      Alert.alert("Login Error", error.message);
    },
    onSuccess: async (data) => {
      console.log(data);

      if (signUpData && signUpData?.profilePhoto) {
        try {
          const response = await FileSystem.uploadAsync(
            `${BACKEND_URL}/user/photo/${signUpData?.email}`,
            signUpData?.profilePhoto.uri,
            {
              fieldName: "photo",
              httpMethod: "POST",
              uploadType: FileSystem.FileSystemUploadType.MULTIPART,
              headers: {},
            }
          );

          console.log("Image Response: ", response);

          if (response.status !== 201) {
            const data = await JSON.parse(response.body);
            console.log("Error: ", data);
            throw new Error(data.message);
          } else {
            const data = await JSON.parse(response.body);
            console.log("Data: ", data);
            queryClient.invalidateQueries();
            await Image.clearDiskCache();
            await Image.clearMemoryCache();
          }
        } catch (error) {
          console.log("Error: ", error);
        }
      }

      // Navigate to login
      router.replace("/login");
    },
  });

  // Prefetch images
  const prefetch = async () => {
    return await Image.prefetch(
      s?.user?.avatarUrl ?? "https://via.placeholder.com/150",
      "memory-disk"
    );
  };

  useEffect(() => {
    // setSession(null);
    let intervalId: NodeJS.Timeout;

    const actualSession = session ? JSON.parse(session) : null;

    const attemptTokenRefresh = async () => {
      try {
        const refreshedToken = await refreshToken(
          actualSession.backendToken.refreshToken
        );

        const newSession: Session = {
          ...actualSession,
          backendToken: refreshedToken,
        };

        setSession(JSON.stringify(newSession));
        setTokenRefreshed(true);
      } catch (error: any) {
        console.error("Error refreshing token:", error);
        // Handle token refresh error, like sign out the user
        Alert.alert("Error refreshing token", error.message);
        setSession(null);
        router.replace("/login");
      }
    };

    if (actualSession && actualSession.backendToken) {
      const expiresInTimestamp = actualSession.backendToken.expiresIn;

      const now = new Date().getTime();
      const delay = expiresInTimestamp - now - 60000; // Refresh 1 minute before expiration

      if (delay > 0) {
        // console.log("Setting timeout with delay: ", delay);
        intervalId = setTimeout(attemptTokenRefresh, delay);
      } else {
        console.log(
          "Token already expired or expiring very soon, attempting immediate refresh"
        );
        attemptTokenRefresh();
      }
    }

    return () => {
      if (intervalId) clearTimeout(intervalId);
    };
  }, [session, setSession]);

  // Get the most update user object
  useEffect(() => {
    queryClient.invalidateQueries();

    // if there is a user, update the session
    if (user) {
      const actualUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLogin: user.lastLogin,
        schoolId: user.schoolId,
        signUpDate: user.signUpDate,
        blurhash: user.blurhash,
        avatarUrl: user.avatarUrl,
        school: user.school,
      };

      const newSession: Session = {
        ...s,
        user: actualUser,
      };

      setSession(JSON.stringify(newSession));
    }

    // Prefetch images
    prefetch();
  }, [user]);

  if (userLoading) {
    return (
      <View className="bg-background-light dark:bg-background-dark flex-1 items-center justify-center">
        <Loading />
      </View>
    );
  }

  if (isError) {
    console.log("Error @Auth-Provider: ", error);
    return (
      <View className="bg-background-light dark:bg-background-dark flex-1 items-center justify-center">
        <Text className="text-text-light dark:text-text-dark">
          {error.message}
        </Text>
      </View>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        signIn: (email: string, password: string) => {
          appSignIn.mutate({ email, password });
        },
        signUp(data) {
          setSignUpData(data);
          appSignUp.mutate(data);
          // console.log("Signing up: ", data);
        },
        signOut: async () => {
          await SecureStore.deleteItemAsync("session");
          await SecureStore.deleteItemAsync("school");
          setSession(null);
          await Invalidate();
        },
        invalidate: Invalidate,
        session: session ? JSON.parse(session) : null,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
