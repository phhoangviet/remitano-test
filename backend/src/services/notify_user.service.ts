import Container, { Service } from 'typedi';
import { EntityRepository, Repository } from 'typeorm';
import { TypeOrmDBConnectionHolder } from './db.service';
import { UserNotificationsEntity } from '@/entities/usersNotify.entity';

@Service()
@EntityRepository()
export class NotifyUser extends Repository<UserNotificationsEntity> {
  _getTypeORMRepository(): Repository<UserNotificationsEntity> {
    const _db = Container.get(TypeOrmDBConnectionHolder);
    const db = _db.getInstance();

    return db.getRepository(UserNotificationsEntity);
  }
}
