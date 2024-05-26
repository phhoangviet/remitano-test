import { connectRouter } from "connected-react-router";
import { BrowserHistory } from "history";
import { combineReducers } from "redux";

const createRootReducer = (history: BrowserHistory) =>
  combineReducers({
    router: connectRouter(history),
  });

export default createRootReducer;
