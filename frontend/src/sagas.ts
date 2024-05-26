import { all } from "redux-saga/effects";
import { sagas as Socket } from "./modules/socket";

export default function* rootSaga() {
  yield all([Socket()]);
}
