import { App } from './app';
import { AuthRoute } from './routes/auth.route';
import { UserRoute } from './routes/user.route';
import { Socket } from './socket';

const app = new App([new AuthRoute(), new UserRoute()]);
export const socket = new Socket();
socket.start();
app.listen();
