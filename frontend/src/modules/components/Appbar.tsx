import { LiveTvOutlined } from "@mui/icons-material";
import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";
import Login from "../auth/Login/Login";

export const MyAppBar = () => {
  return (
    <AppBar position="static" color="default">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <LiveTvOutlined sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            noWrap
            variant="h6"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Funny Movie
          </Typography>
          <Box sx={{ flexGrow: 1 }}></Box>
          <Box sx={{ flexGrow: 0 }}>
            <Login />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
