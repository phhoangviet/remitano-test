import Container, { Service } from 'typedi';
import { EntityRepository, Not, Repository } from 'typeorm';
import { User } from '@interfaces/users.interface';
import { HttpException } from '@/exceptions/HttpException';
import { compare, hash } from 'bcrypt';
import { UserEntity } from '@/entities/users.entity';
import { TypeOrmDBConnectionHolder } from './db.service';
import { SECRET_KEY } from '@/configs';
import { TokenData, DataStoredInToken } from '@/interfaces/auth.interface';
import { sign } from 'jsonwebtoken';

const createToken = (user: User): TokenData => {
  const dataStoredInToken: DataStoredInToken = { id: user.id };
  const secretKey: string = SECRET_KEY;
  const expiresIn: number = 24 * 60 * 60;

  return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
};

const createCookie = (tokenData: TokenData): string => {
  return `Authorization=${tokenData.token};Path=/;Secure=true;HttpOnly=true; Max-Age=${tokenData.expiresIn};SameSite=none`;
};

@Service()
@EntityRepository()
export class AuthService extends Repository<UserEntity> {
  public async signup(userData: User): Promise<User> {
    const repo = this._getTypeORMRepository();
    const findUser: User = await repo.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const dataCreate = repo.create({ ...userData, password: hashedPassword });
    const createUserData: User = await repo.save(dataCreate);
    return createUserData;
  }
  public async findOneUser(id: number): Promise<User> {
    const repo = this._getTypeORMRepository();
    const findUser: User = await repo.findOne({ where: { id: id } });
    if (!findUser) throw new HttpException(409, `Not found user.`);

    return findUser;
  }

  public async findAllUserExcept(ignoreId: number): Promise<User[]> {
    const repo = this._getTypeORMRepository();
    const findUsers: User[] = await repo.find({ where: { id: Not(ignoreId) } });
    return findUsers;
  }

  public async login(userData: User): Promise<{ cookie: string; findUser: User; tokenData: TokenData }> {
    const repo = this._getTypeORMRepository();
    const findUser: User = await repo.findOne({ where: { email: userData.email } });
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Password not matching');

    const tokenData = createToken(findUser);
    const cookie = createCookie(tokenData);

    return { cookie, findUser, tokenData };
  }

  public async logout(userData: User): Promise<User> {
    const repo = this._getTypeORMRepository();
    const findUser: User = await repo.findOne({ where: { email: userData.email } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }
  _getTypeORMRepository(): Repository<UserEntity> {
    const _db = Container.get(TypeOrmDBConnectionHolder);
    const db = _db.getInstance();
    return db.getRepository(UserEntity);
  }
}
