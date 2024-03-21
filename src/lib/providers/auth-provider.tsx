import React, { createContext, useContext, useEffect } from "react";
import { useStorageState } from "../../hooks/useStorageState";
import { useLogin } from "../../hooks/authentication/useAuthentication";
import { Alert, View, Text } from "react-native";
import { router, useRouter } from "expo-router";
import { JWT, Session } from "../../hooks/authentication/authentication";
import { BACKEND_URL } from "../../config/constants";
import * as SecureStore from "expo-secure-store";
import { useQueryClient } from "@tanstack/react-query";
import { useGetUser } from "@/hooks/user/useUser";
import Loading from "@/components/ui/Loading";
import { Image } from "expo-image";

export const AuthContext = createContext<{
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  invalidate: () => void;
  session?: Session | null;
  isLoading: boolean;
}>({
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
  const router = useRouter();
  const queryClient = useQueryClient();

  const s = session ? JSON.parse(session) : null;
  const userId = s?.user?.id;

  const {
    data: user,
    isLoading: userLoading,
    isError,
    error,
  } = useGetUser(userId ?? "");

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

  // Prefetch images
  const prefetch = async () => {
    return await Image.prefetch(
      s?.user?.avatarUrl ?? "https://via.placeholder.com/150",
      "memory-disk"
    );
  };

  // Get the most update user object
  useEffect(() => {
    queryClient.invalidateQueries();

    // if there is a user, update the session
    if (user) {
      const newSession: Session = {
        ...s,
        user,
      };

      setSession(JSON.stringify(newSession));
    }

    // Prefetch images
    prefetch();
  }, [session, setSession]);

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
        signOut: async () => {
          await SecureStore.deleteItemAsync("session");
          await SecureStore.deleteItemAsync("school");
          setSession(null);
          await Invalidate();
          // router.replace("/login");
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
