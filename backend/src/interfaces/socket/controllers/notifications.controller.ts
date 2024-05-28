import { NotificationService } from '@/services/notication.service';
import { UserNotificationService } from '@/services/notify_user.service';
import { logger } from '@/utils/logger';
import { Server } from 'socket.io';
import Container from 'typedi';
import eventsInterface from '../events.interface';
import { UserNotification } from '@/interfaces/user_notify.interface';

export class NotificationController {
  private io: Server;
  public userNotifyService = Container.get(UserNotificationService);
  public notificationService = Container.get(NotificationService);
  constructor(io: Server) {
    this.io = io;
  }
  public sendNotification = async (req: { notificationId: number }) => {
    if (!req.notificationId) {
      logger.error('[SocketSendNotification] The request data is not valid.');
      return;
    }
    const notification = await this.notificationService.findById(req.notificationId);
    if (!notification) {
      logger.info('[SocketSendNotification] Not found notification ${notificationId}.');
      return;
    }
    logger.info(`[SocketSendNotification] Found the notification: ${notification.id}`);
    const userNotifications = await this.userNotifyService.findUserByNofiticationId(req.notificationId);
    const requestsForWeb = await this.sendNotificationWeb(notification.id, userNotifications);
    return Promise.all(requestsForWeb).then(() => {
      logger.info(`[SocketSendNotification] The notification '${notification.id}' has been sent!`);
    });
  };

  private sendNotificationWeb = async (notificationId: number, userNotification: UserNotification[]) => {
    const requests: Promise<void>[] = (userNotification || []).map(async acc => {
      return new Promise<void>(resolve => {
        const identityName = acc.user.email;
        logger.info(`[SocketSendNotification] Send notification '${notificationId}' to user - '${identityName}'.'`);
        this.io.to(`${identityName}`).emit(eventsInterface.Notification, acc);
        return resolve();
      });
    });
    return requests;
  };
}
