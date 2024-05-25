import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { UserEntity } from '@entities/users.entity';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import { SECRET_KEY } from '@/configs';
import { HttpException } from '@/exceptions/HttpException';
import Container from 'typedi';
import { AuthService } from '@/services/auth.service';

const getAuthorization = req => {
  const cookie = req.cookies['Authorization'];
  if (cookie) return cookie;

  const header = req.header('Authorization');
  if (header) return header.split('Bearer ')[1];

  return null;
};

export const AuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = getAuthorization(req);
    const auth = Container.get(AuthService);
    if (Authorization) {
      const { id } = verify(Authorization, SECRET_KEY) as DataStoredInToken;
      const findUser = await auth.findOneUser(id);

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};
