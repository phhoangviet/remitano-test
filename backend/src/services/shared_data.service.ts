import { SharedDataEntity } from '@/entities/sharedData.entity';
import Container, { Service } from 'typedi';
import { EntityRepository, Repository } from 'typeorm';
import { TypeOrmDBConnectionHolder } from './db.service';
import { SharedData } from '@/interfaces/shared_data.interface';
import { HttpException } from '@/exceptions/HttpException';

@Service()
@EntityRepository()
export class SharedService extends Repository<SharedDataEntity> {
  public async createData(data: SharedData): Promise<SharedData> {
    const repo = this._getTypeORMRepository();

    const findExisted: SharedData = await repo.findOne({ relations: ['user'], where: { url: data.url, createdById: data.user.id } });
    console.log(findExisted);
    if (findExisted) throw new HttpException(409, `This url was shared`);
    const resp = repo.create({ ...data, createdById: data.user.id });
    await repo.save(resp);
    return resp;
  }
  _getTypeORMRepository(): Repository<SharedDataEntity> {
    const _db = Container.get(TypeOrmDBConnectionHolder);
    const db = _db.getInstance();

    return db.getRepository(SharedDataEntity);
  }
}
