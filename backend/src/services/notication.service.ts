import Container, { Service } from 'typedi';
import { EntityRepository, In, Repository } from 'typeorm';
import { TypeOrmDBConnectionHolder } from './db.service';
import { NotificationEntity } from '@/entities/notify.entity';
import { Notification } from '@/interfaces/notify.interface';
import { HttpException } from '@/exceptions/HttpException';
import { logger } from '@/utils/logger';
import { UserNotification } from '@/interfaces/user_notify.interface';
import { UserNotificationService } from './notify_user.service';

@Service()
@EntityRepository()
export class NotificationService extends Repository<NotificationEntity> {
  public userNotifyService = Container.get(UserNotificationService);
  public async findById(id: number): Promise<Notification | undefined> {
    const repo = this._getTypeORMRepository();
    const res = await repo.findOne(id);
    return res;
  }

  public async findByRefs(refs: number[]): Promise<Notification[]> {
    const repo = this._getTypeORMRepository();
    const res = await repo.find({
      where: {
        refId: In(refs),
      },
      order: {
        createdAt: 'DESC',
      },
    });
    return res;
  }
  public async createNotification(d: Notification, userIds: number[]): Promise<Notification> {
    const repo = this._getTypeORMRepository();
    const res = await repo.save({ ...d }, { reload: true });

    if (userIds.length > 0) {
      const mappingCreateUserRecvNoti: UserNotification[] = userIds.map(el => {
        return {
          userId: el,
          notificationId: res.id,
        };
      });

      const _resAccountNotification = await this.userNotifyService.createMany(mappingCreateUserRecvNoti);
      if (_resAccountNotification.length === 0) {
        logger.error(`Create Account Notification: Failed notification_id: ${res.id}`);
      }
    }

    return res;
  }
  _getTypeORMRepository(): Repository<NotificationEntity> {
    const _db = Container.get(TypeOrmDBConnectionHolder);
    const db = _db.getInstance();

    return db.getRepository(NotificationEntity);
  }
}
