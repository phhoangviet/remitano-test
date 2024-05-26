import io, { Socket } from "socket.io-client";
import { socketApi } from "../../constants/configs";
import { eventChannel } from "redux-saga";
import { fork, call, put, take, cancel } from "redux-saga/effects";

export const EVENT_SOCKET = {
  connect: "connect",
  notification: "notification",
  authenticate: "authenticate",
};
function connect() {
  const socket = io(socketApi, {
    port: 8888,
    path: "/socket.io",
    forceNew: true,
    reconnectionAttempts: 10,
    reconnectionDelayMax: 10000,
    transports: ["websocket"],
  });
  return new Promise((resolve) => {
    socket.on(EVENT_SOCKET.connect, () => {
      socket.emit(EVENT_SOCKET.authenticate, {});
      resolve(socket);
    });
  });
}
function* read(socket: Socket): any {
  const channel = yield call(subscribe, socket);

  while (true) {
    let action = yield take(channel);
    yield put(action);
  }
}
function subscribe(socket: Socket) {
  return eventChannel((emit) => {
    return () => {};
  });
}
function* handleIO(socket: Socket) {
  yield fork(read, socket);
}

function* flowSocket(): any {
  const socket: Socket = yield call(connect);

  const task = yield fork(handleIO, socket);

  yield cancel(task);
}

function* flow() {
  while (true) {
    yield call(flowSocket);
  }
}

export default function* rootSaga() {
  yield fork(flow);
}
