import React, { createContext, useContext, useEffect } from "react";
import { useStorageState } from "../../hooks/useStorageState";
import { useLogin } from "../../hooks/authentication/useAuthentication";
import { Alert } from "react-native";
import { router, useRouter } from "expo-router";
import { JWT, Session } from "../../hooks/authentication/authentication";
import { BACKEND_URL } from "../../config/constants";
import * as SecureStore from "expo-secure-store";

export const AuthContext = createContext<{
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  session?: Session | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
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

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    // console.log("listening for token expiration");

    const actualSession = session ? JSON.parse(session) : null;

    const attemptTokenRefresh = async () => {
      try {
        // console.log("Attempting token refresh");
        const refreshedToken = await refreshToken(
          actualSession.backendToken.refreshToken
        );
        // console.log("Token refreshed: ", refreshedToken);

        const newSession: Session = {
          ...actualSession,
          backendToken: refreshedToken,
        };

        // console.log("New session: ", newSession);

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
      // console.log("Session found, scheduling token refresh");

      const expiresInTimestamp = actualSession.backendToken.expiresIn;
      // console.log("Token expires at (timestamp): ", expiresInTimestamp);

      const now = new Date().getTime();
      const delay = expiresInTimestamp - now - 60000; // Refresh 1 minute before expiration
      // console.log("Calculated delay for refresh: ", delay);

      if (delay > 0) {
        console.log("Setting timeout with delay: ", delay);
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

  return (
    <AuthContext.Provider
      value={{
        signIn: (email: string, password: string) => {
          // Perform sign-in logic here
          appSignIn.mutate({ email, password });
        },
        signOut: async () => {
          // setSession(null);
          await SecureStore.deleteItemAsync("session");
          await SecureStore.deleteItemAsync("school");

          router.replace("/login");
        },
        session: session ? JSON.parse(session) : null,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
