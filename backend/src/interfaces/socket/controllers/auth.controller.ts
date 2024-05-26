import * as _ from 'underscore';

import { logger } from '@/utils/logger';
import { BaseController } from './base.controller';
import Container from 'typedi';
import { AuthService } from '@/services/auth.service';
import { DataStoredInToken } from '@/interfaces/auth.interface';
import { verify } from 'jsonwebtoken';

import { SECRET_KEY } from '@/configs';

export class AuthController extends BaseController {
  public authenticate = async (data: { token: string }) => {
    try {
      const auth = Container.get(AuthService);
      const { id } = verify(data.token, SECRET_KEY) as DataStoredInToken;
      const findUser = await auth.findOneUser(id);
      if (findUser) {
        this.socket.auth = true;
        this.socket.account = findUser;
        const listnsps = await this.io.fetchSockets();
        _.each(listnsps, (nsp: any) => {
          if (_.findWhere(nsp.sockets, { id: this.socket.id })) {
            nsp.connected[this.socket.id] = this.socket;
          }
        });
        this.socket.join(findUser.email);
        logger.info(`Socket - connected - ${findUser.email}`);
      }
    } catch (err: any) {
      logger.error(err);
    }
  };
}
