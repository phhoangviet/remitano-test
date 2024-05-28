import { axiosInstance } from "./base";

export const handleShare = async (url: string) => {
  return await axiosInstance.post(
    `/users/share`,
    {
      url,
    },
    { withCredentials: true }
  );
};

export const handleGetSharedByOther = async () => {
  return await axiosInstance.get(`/users/my-notifications`, {
    withCredentials: true,
  });
};
