import { SharedDataEntity } from '@/entities/sharedData.entity';
import Container, { Service } from 'typedi';
import { EntityRepository, Not, Repository } from 'typeorm';
import { TypeOrmDBConnectionHolder } from './db.service';
import { SharedData } from '@/interfaces/shared_data.interface';
import { HttpException } from '@/exceptions/HttpException';
import { User } from '@/interfaces/users.interface';

@Service()
@EntityRepository()
export class SharedService extends Repository<SharedDataEntity> {
  public async createData(data: SharedData): Promise<SharedData> {
    const repo = this._getTypeORMRepository();

    const findExisted: SharedData = await repo.findOne({ relations: ['user'], where: { url: data.url, createdById: data.user.id } });
    if (findExisted) throw new HttpException(201, `This url was shared`);
    const resp = repo.create({ ...data, createdById: data.user.id });
    await repo.save(resp);
    return resp;
  }

  public async getMyShared(user: User): Promise<SharedData[]> {
    const repo = this._getTypeORMRepository();
    const res = await repo.find({ relations: ['user'], where: { createdById: user.id } });
    return res;
  }
  public async getSharedByOther(user: User): Promise<SharedData[]> {
    const repo = this._getTypeORMRepository();
    const res = await repo.find({ relations: ['user'], where: { createdById: Not(user.id) } });
    return res;
  }
  _getTypeORMRepository(): Repository<SharedDataEntity> {
    const _db = Container.get(TypeOrmDBConnectionHolder);
    const db = _db.getInstance();
    return db.getRepository(SharedDataEntity);
  }
}
