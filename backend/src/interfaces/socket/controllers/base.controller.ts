import { Server } from 'socket.io';
import eventsInterface from '../events.interface';
import { logger } from '@/utils/logger';

export class BaseController {
  protected socket: any;
  protected io: Server;

  constructor(io: any, socket: any) {
    this.socket = socket;
    this.io = io;
  }

  public handleError(err: any) {
    this.socket.emit(eventsInterface.Exception, {
      message: err.message,
      errorCode: err.errorCode,
      name: err.name,
    });
  }

  public handleValidationError(err: any) {
    this.handleError(err);
    logger.error('Validation Error:', err);
  }
}
