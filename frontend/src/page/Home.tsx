import { MyAppBar } from "../modules/components/Appbar";
import { ListMovie } from "../modules/components/ListMovie";
import { useAuth } from "../providers/auth/useAuth";

const HomePage = () => {
  const { authenticated } = useAuth();
  return (
    <>
      <MyAppBar />
      {authenticated ? <ListMovie /> : <>Please Login first</>}
    </>
  );
};

export default HomePage;
