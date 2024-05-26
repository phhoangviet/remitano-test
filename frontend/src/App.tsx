import React from "react";
import "./App.css";
import { Provider } from "react-redux";
import store from "./store";
import history from "./history";
import AppRoutes from "./routers";
import { ConnectedRouter } from "connected-react-router";

function App() {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <div className="App">
          <AppRoutes />
        </div>
      </ConnectedRouter>
    </Provider>
  );
}

export default App;
