import { SharedDataEntity } from '@/entities/shared_data.entity';
import Container, { Service } from 'typedi';
import { EntityRepository, Repository } from 'typeorm';
import { TypeOrmDBConnectionHolder } from './db.service';

@Service()
@EntityRepository()
export class SharedService extends Repository<SharedDataEntity> {
  _getTypeORMRepository(): Repository<SharedDataEntity> {
    const _db = Container.get(TypeOrmDBConnectionHolder);
    const db = _db.getInstance();
    SharedDataEntity.useConnection(db);
    return db.getRepository(SharedDataEntity);
  }
}
