import React, { useContext } from "react";
import { IAuthContext } from "./AuthProvider";
export const defaultValue: IAuthContext = {
  authenticated: false,
  user: { email: "", id: 0 },
  login: ({ id, _email }: { id: number; _email: string }) => undefined,
  logOut: () => undefined,
  getUser: () => Promise.resolve(undefined),
};
export const AuthContext = React.createContext<IAuthContext>(defaultValue);

export const useAuth = () => useContext(AuthContext);
