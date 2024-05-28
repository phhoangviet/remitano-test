import { Button, TextField, Typography } from "@mui/material";
import { AxiosResponse } from "axios";
import { useForm } from "react-hook-form";
import {
  handleLogin,
  handleLogout,
  handleRegister,
  UserInfo,
} from "../../../apis/auth";
import { useAuth } from "../../../providers/auth/useAuth";
import React, { useEffect } from "react";
import { useToast } from "../../../providers/toast/useToast";
type LoginInput = {
  email: string;
  password: string;
};

const Login = () => {
  const { register, getValues, resetField } = useForm<LoginInput>();
  const { authenticated, login, user, getUser, logOut } = useAuth();
  const toast = useToast();
  useEffect(() => {
    async function _getUser() {
      await getUser();
    }
    if (authenticated) return;
    if (window.localStorage.getItem("token")) {
      _getUser();
    }
  }, [user?.id, getUser, authenticated, user.email]);
  const onLogin = async () => {
    const { email, password } = getValues();
    try {
      const resp: AxiosResponse<{ data: UserInfo }> = await handleLogin({
        email,
        password,
      });
      if (resp?.data?.data) {
        const user = resp.data.data.findUser;
        window.localStorage.setItem("token", resp.data.data.accessToken.token);
        login({ id: user.id, _email: user.email });
        resetField("email");
        resetField("password");
        toast.success("Login successfully.");
      } else {
        toast.error("Please check your email or password.");
      }
    } catch (error: any) {
      toast.error(`Register failed. ${error?.response?.data?.message || ""}`);
    }
  };
  const onRegister = async () => {
    const { email, password } = getValues();
    try {
      const resp: AxiosResponse<{ data: UserInfo; message: string }> =
        await handleRegister({
          email,
          password,
        });
      if (resp?.data?.data) {
        resetField("email");
        resetField("password");
        toast.success(
          "Register account successfully. Please login with your infomation."
        );
      } else {
        toast.error(`Register failed. ${resp.data?.message || ""}`);
      }
    } catch (error: any) {
      toast.error(`Register failed. ${error?.response?.data?.message || ""}`);
    }
  };
  const onLogout = async () => {
    try {
      await handleLogout();
      logOut();
      toast.success("Logout successfully.");
    } catch (error: any) {
      toast.error(`Register failed. ${error?.response?.data?.message || ""}`);
    }
  };
  return (
    <React.Fragment>
      {authenticated ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Typography component={"h6"} style={{ marginRight: "12px" }}>
            Welcome {user.email}
          </Typography>

          <Button
            size="small"
            type="button"
            variant="text"
            onClick={() => onLogout()}
            color="error"
          >
            Logout
          </Button>
        </div>
      ) : (
        <form style={{ display: "flex", justifyContent: "space-around" }}>
          <TextField
            label="Email"
            size="small"
            type="email"
            placeholder="youremail@gmail.com"
            {...register("email")}
            style={{ marginRight: "6px" }}
          />
          <TextField
            label="Password"
            size="small"
            type="password"
            {...register("password")}
            style={{ marginRight: "6px" }}
          />
          <Button
            size="small"
            type="button"
            variant="outlined"
            style={{ marginRight: "6px" }}
            onClick={() => onLogin()}
          >
            Login
          </Button>
          <Button
            size="small"
            type="button"
            variant="text"
            style={{ marginRight: "6px" }}
            onClick={() => onRegister()}
          >
            Register
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};
export default Login;
