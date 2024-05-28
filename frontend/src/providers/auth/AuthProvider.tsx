import { ReactNode, useEffect, useRef, useState } from "react";
import { AuthContext, defaultValue } from "./useAuth";
import { handleGetme, UserModel } from "../../apis/auth";
import { AxiosResponse } from "axios";
export interface IAuthContext {
  authenticated: boolean;
  user: { id: number; email: string };
  login: ({ id, _email }: { id: number; _email: string }) => void;
  logOut: () => void;
  getUser: () => Promise<void>;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [authenticated, setAuthenticated] = useState(
    defaultValue.authenticated
  );
  const [user, setUser] = useState({
    id: defaultValue.user.id,
    email: defaultValue.user.email,
  });
  const timer = useRef<NodeJS.Timeout>();
  useEffect(() => {
    if (authenticated) {
      timer.current = setInterval(() => getUser(), 60000);
      return () => {
        clearInterval(timer.current);
      };
    }
  }, [authenticated]);

  const login = ({ id, _email }: { id: number; _email: string }) => {
    setAuthenticated(true);
    setUser({ id, email: _email });
  };
  const logOut = () => {
    setAuthenticated(false);
    window.localStorage.removeItem("token");
    setUser({
      id: 0,
      email: "",
    });
  };

  const getUser = async () => {
    try {
      const resp: AxiosResponse<{ data: UserModel }> = await handleGetme();
      if (resp.status === 200 && resp.data) {
        const userResp = resp.data.data;
        setUser({ id: userResp.id, email: userResp.email });
        setAuthenticated(true);
      }
    } catch (error: any) {
      if (error?.response?.status === 401 || error?.response?.status === 404) {
        setAuthenticated(false);
        window.localStorage.removeItem("token");
        setUser({
          id: 0,
          email: "",
        });
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{ authenticated, login, logOut, user, getUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
