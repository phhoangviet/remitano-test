import Container, { Service } from 'typedi';
import { EntityRepository, Repository } from 'typeorm';
import { TypeOrmDBConnectionHolder } from './db.service';
import { NotificationEntity } from '@/entities/notify.entity';

@Service()
@EntityRepository()
export class Notification extends Repository<NotificationEntity> {
  _getTypeORMRepository(): Repository<NotificationEntity> {
    const _db = Container.get(TypeOrmDBConnectionHolder);
    const db = _db.getInstance();

    return db.getRepository(NotificationEntity);
  }
}
