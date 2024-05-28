import { RequestWithUser } from '@/interfaces/auth.interface';
import { Notification } from '@/interfaces/notify.interface';
import { SharedData } from '@/interfaces/shared_data.interface';
import { NotificationController } from '@/interfaces/socket/controllers/notifications.controller';
import { UserNotification } from '@/interfaces/user_notify.interface';
import { socket } from '@/server';
import { AuthService } from '@/services/auth.service';
import { NotificationService } from '@/services/notication.service';
import { UserNotificationService } from '@/services/notify_user.service';
import { SharedService } from '@/services/shared_data.service';
import { Socket } from '@/socket';
import { logger } from '@/utils/logger';
import { Request, Response, NextFunction } from 'express';
import Container from 'typedi';
import ytdl from 'ytdl-core';

export class UserController {
  public shared = Container.get(SharedService);
  public auth = Container.get(AuthService);
  public notification = Container.get(NotificationService);
  public userNotification = Container.get(UserNotificationService);
  public handleShare = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user } = req;
      const { url } = req.body;
      const resp = await ytdl.getBasicInfo(url);
      if (resp.videoDetails) {
        const respData: SharedData = await this.shared.createData({
          user: user,
          title: resp.videoDetails.title,
          url: resp.videoDetails.video_url,
          content: resp.videoDetails.description,
        });
        const listUserExceptMe = await this.auth.findAllUserExcept(user.id);
        const dataNotify: Notification = {
          group: 'YOUTUBE',
          refId: user.id,
          refCode: user.email,
          title: resp.videoDetails.title,
          content: resp.videoDetails.description,
          url: resp.videoDetails.video_url,
          action: 'SHARE',
          createdById: user.id,
        };
        const respCreateNoti = await this.notification.createNotification(
          dataNotify,
          listUserExceptMe.map(el => el.id),
        );
        if (!respCreateNoti) {
          logger.error('[NotificationError] Fail create Notification');
        } else {
          const insSocket = socket.getInstance();
          const notifyController = new NotificationController(insSocket);
          await notifyController.sendNotification({ notificationId: respCreateNoti.id });
        }
        res.status(201).json({ data: respData });
      }
    } catch (error) {
      next(error);
    }
  };

  public getMyShared = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user } = req;
      const resp: SharedData[] = await this.shared.getMyShared(user);
      res.status(201).json({ data: resp });
    } catch (error) {
      next(error);
    }
  };

  public getSharedByOther = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user } = req;
      const resp: UserNotification[] = await this.userNotification.getInfoNotificationExcept(user);
      res.status(201).json({ data: resp });
    } catch (error) {
      next(error);
    }
  };
}
