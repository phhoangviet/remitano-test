import createSagaMiddleware from "redux-saga";
import rootSaga from "./sagas";
import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
} from "redux";

import createRootReducer from "./reducers";
import history from "./history";
import { routerMiddleware } from "connected-react-router";
const sagaMiddleware = createSagaMiddleware();

const middleWare = [routerMiddleware(history), sagaMiddleware];

const store = createStore(
  createRootReducer(history),
  {},
  compose(applyMiddleware(...middleWare))
);
sagaMiddleware.run(rootSaga);
export default store;
