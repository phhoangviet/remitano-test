import { Server } from 'socket.io';
import { AuthController } from './controllers/auth.controller';
import { logger } from '@/utils/logger';
import events from './events.interface';

export const registerEvents = (io: Server, socket: any) => {
  const authController = new AuthController(io, socket);
  socket.on(events.Authenticate, authController.authenticate);

  socket.on(events.Error, (error: any) => {
    logger.error('Socket error ', error);
  });
};
