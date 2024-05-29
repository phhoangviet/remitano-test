import { useEffect, useState } from "react";
import { useAuth } from "../../providers/auth/useAuth";
import { socket } from "../socket/socket";
import {
  Alert,
  Button,
  Container,
  Grid,
  Snackbar,
  SnackbarOrigin,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useToast } from "../../providers/toast/useToast";
import { handleGetSharedByOther, handleShare } from "../../apis/users";
import { ListMovieData } from "./ListMovieData";
import { UserNotification } from "../../constants/types";
import { AxiosResponse } from "axios";
interface StateSnack extends SnackbarOrigin {
  open: boolean;
  message: string;
}

export const ListMovie = () => {
  const { register, getValues, resetField } = useForm<{ url: string }>();
  const { authenticated } = useAuth();
  const [dataMovie, setDataMovie] = useState<UserNotification[]>([]);
  const [_total, setTotal] = useState(0);
  const toast = useToast();

  useEffect(() => {
    async function _getMyNoti() {
      if (!authenticated || dataMovie.length > 0) {
        return;
      }
      try {
        const res: AxiosResponse<{
          data: { items: UserNotification[]; total: number };
        }> = await handleGetSharedByOther();
        if (res.data.data) {
          setDataMovie(res.data.data.items);
          setTotal(res.data.data.total || 0);
        }
      } catch (error) {
        toast.error("Get Notifications failed.");
      }
    }
    _getMyNoti();
  }, [toast, authenticated, dataMovie.length]);

  const onClickShare = async () => {
    const { url } = getValues();
    try {
      const resp = await handleShare(url);
      if (resp.data && resp.data?.data) {
        toast.success("Shared url successfully.");
        resetField("url");
      } else {
        toast.error(
          `${resp.data?.message || ""}.Shared url failed. Try again! `
        );
      }
    } catch (error: any) {
      toast.error(`Shared url failed. ${error?.response?.data?.message || ""}`);
    }
  };
  const [state, setState] = useState<StateSnack>({
    open: false,
    vertical: "top",
    horizontal: "center",
    message: "",
  });
  useEffect(() => {
    // no-op if the socket is already connected
    socket.connect();
    if (authenticated && !socket.connected) {
      socket.emit("authenticate", {
        token: window.localStorage.getItem("token"),
      });
    }
    return () => {
      socket.disconnect();
    };
  }, [authenticated]);
  useEffect(() => {
    function handleData(data: UserNotification) {
      setState({
        ...state,
        open: true,
        message: `${data.user?.email} was shared Youtube Video: ${data.notification?.title}`,
      });
      setDataMovie([data, ...dataMovie]);
    }
    socket.on("notification", handleData);

    return () => {
      socket.off("notification", handleData);
    };
  }, [dataMovie, toast, state]);

  const { vertical, horizontal, open, message } = state;
  const handleClose = () => {
    setState({ ...state, open: false, message: "" });
  };
  return (
    <Container maxWidth="xl" style={{ marginTop: "10px" }}>
      <Snackbar
        autoHideDuration={5000}
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        key={vertical + horizontal}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
      <Grid container>
        <Grid
          item
          xs={12}
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <Typography
            noWrap
            component={"h6"}
            style={{ maxWidth: "200px", width: "150px" }}
          >
            Share new youtube
          </Typography>
          <TextField
            type="text"
            {...register("url")}
            label="Link youtube"
            size="small"
            style={{ width: "80%" }}
          />
          <Button
            variant="contained"
            type="button"
            color="success"
            style={{ margin: "0 10px" }}
            onClick={onClickShare}
            disabled={!socket.connected}
          >
            Share
          </Button>
        </Grid>
        <Grid item xs={12}>
          <ListMovieData key={"movie-data"} data={dataMovie} />
        </Grid>
      </Grid>
    </Container>
  );
};
