import { Route, Switch } from "react-router";

const AppRoutes = () => {
  return (
    <Switch>
      <Route path="/" render={() => <>Hello</>}></Route>
    </Switch>
  );
};
export default AppRoutes;
