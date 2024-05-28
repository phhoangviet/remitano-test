import Container, { Service } from 'typedi';
import { EntityRepository, Not, Repository } from 'typeorm';
import { TypeOrmDBConnectionHolder } from './db.service';
import { UserNotificationsEntity } from '@/entities/usersNotify.entity';
import { UserNotification } from '@/interfaces/user_notify.interface';
import { HttpException } from '@/exceptions/HttpException';
import { User } from '@/interfaces/users.interface';

@Service()
@EntityRepository()
export class UserNotificationService extends Repository<UserNotificationsEntity> {
  public async createMany(data: UserNotification[]): Promise<UserNotification[]> {
    const repo = this._getTypeORMRepository();
    const res = await repo.save(data, { reload: true });
    return res;
  }
  public async findUserByNofiticationId(notificationId: number): Promise<UserNotification[]> {
    const repo = this._getTypeORMRepository();
    const _res = await repo.find({
      relations: ['notification', 'user'],
      where: { notificationId: notificationId },
    });
    if (!_res) throw new HttpException(404, "UserNotification doesn't exist");
    return _res;
  }
  public async findByUserId(
    userId: number,
    pagination: { limit: number; skip: number },
    unread?: boolean,
  ): Promise<{ items: UserNotification[]; total: number }> {
    const repo = this._getTypeORMRepository();

    const [items, total] = await repo.findAndCount({
      relations: ['notification'],
      where: {
        userId: userId,
        ...(unread !== undefined ? { markAsRead: unread } : {}),
      },
      take: pagination.limit,
      skip: pagination.skip,
    });

    return { items, total };
  }
  public async markAsReadAll(userId: number): Promise<any> {
    const repo = this._getTypeORMRepository();
    await repo
      .createQueryBuilder('q')
      .update(UserNotificationsEntity)
      .set({
        markAsRead: true,
      })
      .where('userId = :userId', { userId: userId })
      .andWhere('markAsRead = :markAsRead', { markAsRead: false })
      .execute();
  }
  public async getInfoNotificationExcept(user: User): Promise<UserNotification[]> {
    const repo = this._getTypeORMRepository();
    const res = await repo.find({ relations: ['notification', 'user'], where: { userId: Not(user.id) } });
    return res;
  }
  async markAsReadById(id: number, userId: number): Promise<any> {
    const repo = this._getTypeORMRepository();
    const currentNoti = await repo.findOne(id, { where: { userId: userId } });
    if (!currentNoti) throw new HttpException(404, "UserNotification doesn't exist");

    await repo.save({ ...currentNoti, markAsRead: true }, { reload: true });
  }
  _getTypeORMRepository(): Repository<UserNotificationsEntity> {
    const _db = Container.get(TypeOrmDBConnectionHolder);
    const db = _db.getInstance();
    return db.getRepository(UserNotificationsEntity);
  }
}
