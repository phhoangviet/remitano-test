import { Container, Grid, Link, Tooltip, Typography } from "@mui/material";
import { UserNotification } from "../../constants/types";
import moment from "moment";
import Video from "./Video";

export const ListMovieData = ({ data }: { data: UserNotification[] }) => {
  return (
    <Container maxWidth={"xl"} style={{ marginTop: 10 }}>
      {data.map((_data, index: number) => (
        <Link
          href={_data?.notification?.url || ""}
          target="_blank"
          rel="noreferrer"
        >
          <Grid key={_data.user?.email} container spacing={4}>
            <Grid item xs={4}>
              <Video video={_data?.notification?.url || ""}></Video>
            </Grid>
            <Grid item xs={8}>
              <Typography component={"h4"}>
                <b>{_data?.notification?.title}</b>
              </Typography>

              <Tooltip title="asd" disableHoverListener={true}>
                <p
                  style={{
                    fontSize: 14,
                  }}
                >
                  Shared by: {_data?.notification?.refCode}
                  <br />
                  {moment(_data?.createdAt).format("hh:mm DD-MM-YYYY")}
                </p>
              </Tooltip>
            </Grid>
          </Grid>
        </Link>
      ))}
    </Container>
  );
};
