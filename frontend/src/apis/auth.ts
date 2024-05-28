import { axiosInstance } from "./base";
export type UserInfo = {
  findUser: {
    id: number;
    email: string;
    password: string;
  };
  accessToken: {
    token: string;
  };
};
export type UserModel = {
  id: number;
  email: string;
  password: string;
};
export const handleLogin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  return await axiosInstance.post(
    `/login`,
    {
      email: email,
      password: password,
    },
    { withCredentials: true }
  );
};
export const handleGetme = async () => {
  return await axiosInstance.get(`/me`, { withCredentials: true });
};
export const handleLogout = async () => {
  return await axiosInstance.post(`/logout`, { withCredentials: true });
};
export const handleRegister = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  return await axiosInstance.post(
    `/signup`,
    {
      email: email,
      password: password,
    },
    { withCredentials: true }
  );
};
