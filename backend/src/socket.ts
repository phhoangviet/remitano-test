import express, { application } from 'express';
import { logger } from './utils/logger';
import { ORIGIN, SOCKET_PORT, SOCKET_TRANSPORTS, WEB_HOST } from './configs';
import { Server } from 'socket.io';
import http from 'http';
import { registerEvents } from './interfaces/socket/register.interface';
export class Socket {
  private _instance: http.Server;
  private io: Server;

  public getInstance(): Server {
    if (this.io === null) {
      throw new Error('Please call start() once before calling this method if you can.');
    }
    return this.io;
  }

  public async start(): Promise<http.Server> {
    try {
      const socketApp = express();
      const socketConfig = this.socketConfig();
      const httpServer = http.createServer(socketApp);
      const io = new Server(httpServer, { ...socketConfig, cookie: true, cors: { origin: ORIGIN } });
      this.io = io;

      io.on('connection', (socket: any) => {
        registerEvents(io, socket);
        setTimeout(async () => {
          if (!socket.auth) {
            // logger.info(`Disconnecting socket: ${socket.id}`);
            await socket.disconnect('Unauthorized');
          }
        }, 3000);
      });
      this._instance = httpServer;
      this._instance.listen(+SOCKET_PORT || 8888, () => {
        logger.info(`=================================`);
        logger.info(`🚀 Socket listening on the port ${SOCKET_PORT}`);
      });
      logger.info(`Socket - listen at ${JSON.stringify(+SOCKET_PORT || 8888)}`);
      return this._instance;
    } catch (error) {
      logger.info(`Socket - There was something wrong: ${error}`);
      throw error;
    }
  }

  private socketConfig() {
    let socketTransports = ['websocket'];
    if (SOCKET_TRANSPORTS) {
      logger.info(`Socket - Load socket transports from env: ${SOCKET_TRANSPORTS}`);
      socketTransports = SOCKET_TRANSPORTS.split(',');
    }

    const config = {
      path: '/socket.io',
      transports: socketTransports,
    } as any;
    if (process.env.SOCKET_SECURE === String(true)) {
      config.secure = true;
    }

    return config;
  }
}
