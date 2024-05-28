import { Server } from 'socket.io';

export class NotificationController {
  private io: Server;
  constructor(io: Server) {
    this.io = io;
  }
}
