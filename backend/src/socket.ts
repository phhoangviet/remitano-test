import express, { application } from 'express';
import { logger } from './utils/logger';
import { SOCKET_PORT, SOCKET_TRANSPORTS } from './configs';
import { Server } from 'socket.io';
import http from 'http';
export class Socket {
  private _instance: express.Application;
  private io: Server;

  public getInstance(): Server {
    if (this.io === null) {
      throw new Error('Please call start() once before calling this method if you can.');
    }
    return this.io;
  }

  public async start(): Promise<express.Application> {
    try {
      this._instance = express();
      const socketConfig = this.socketConfig();
      const httpServer = http.createServer(this._instance);
      const io = new Server(httpServer, socketConfig);
      this.io = io;
      io.on('connection', (socket: any) => {
        // registerEvents(io, socket);

        setTimeout(async () => {
          if (!socket.auth) {
            logger.info(`Disconnecting socket: ${socket.id}`);
            await socket.disconnect('Unauthorized');
          }
        }, 5000);
      });
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
