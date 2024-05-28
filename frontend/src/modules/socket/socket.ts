import { io } from "socket.io-client";
import { socketApi } from "../../constants/configs";

const URL = socketApi;

export const socket = io(URL, {
  port: 8888,
  path: "/socket.io",
  forceNew: true,
  autoConnect: true,
  reconnectionAttempts: 10,
  reconnectionDelayMax: 10000,
  transports: ["websocket"],
});
