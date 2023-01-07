import { createContext, ReactNode, useContext, useState } from "react";
import { api } from "../constants";
import { User } from "../model/User";
import {
  lsGetSessionId,
  lsGetUser,
  lsRemoveSessionId,
  lsRemoveUser,
  lsSetSessionId,
  lsSetUser,
} from "../utils/helpers";

interface AuthState {
  user: User;
  sessionId: string;
}

interface AuthStateContextI {
  user: User | null;
  signin: (authState: AuthState) => void;
  signout: () => void;
  autoLogin: () => void;
  isAuthenticated: () => boolean;
}

interface AuthStateProviderProps {
  children: ReactNode;
}

const AuthStateContext = createContext<AuthStateContextI>(
  {} as AuthStateContextI
);

export function useAuthContext() {
  const context = useContext(AuthStateContext);
  if (!context)
    throw new Error("useAuthState must be used within AuthProvider");

  return context;
}

export function AuthStateProvider({ children }: AuthStateProviderProps) {
  const [authState, setAuthState] = useState<AuthState | null>(null);

  const signin = (authState: AuthState) => {
    if (!authState.user || !authState.sessionId) return;

    setAuthState(authState);
    lsSetSessionId(authState.sessionId);
    lsSetUser(authState.user);
  };

  const signout = () => {
    setAuthState(null);

    api.put("/user/signout", {}).then(() => {
      lsRemoveSessionId();
    });

    lsRemoveUser();
  };

  const autoLogin = () => {
    const user = lsGetUser();
    const sessionId = lsGetSessionId();
    console.log(user, sessionId)
    if (!user || !sessionId) {
      return;
    }
    const token = {sessionId: sessionId, user:user};
    console.log(token)
    setAuthState(token);
    console.log(authState)
    console.log("autologin se pozvao")
  };

  const isAuthenticated = () => {
    console.log("isAuth");
    return authState?.sessionId ? true : false;
  };

  

  return (
    <AuthStateContext.Provider
      value={{
        autoLogin,
        signin,
        signout,
        isAuthenticated,
        user: authState?.user!,
      }}
    >
      {children}
    </AuthStateContext.Provider>
  );
}
