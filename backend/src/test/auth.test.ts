import bcrypt from 'bcrypt';

import { CreateUserDto } from '@/dtos/user.dto';
import { AuthRoute } from '@/routes/auth.route';
import { AuthService } from '@/services/auth.service';
import Container from 'typedi';
import { App } from '@/app';
import request from 'supertest';
import { TypeOrmDBConnectionHolder } from '@/services/db.service';

const db = Container.get(TypeOrmDBConnectionHolder);
beforeAll(async () => {
  await db.initialize('interview-test');
});

afterAll(async () => {
  await db.close();
});
describe('Testing authentication', () => {
  describe('[Signup account]', () => {
    const userReq: CreateUserDto = {
      email: `test-${new Date().getTime()}@gmail.com`,
      password: '123456789',
    };
    const invalidUserEmail: CreateUserDto = {
      email: 'testing',
      password: '123456789',
    };
    const invalidUserPass: CreateUserDto = {
      email: 'testing@gmail.com',
      password: '123',
    };

    const authRoute = new AuthRoute();
    const authService = Container.get(AuthService);

    it('Should return invalid Email', async () => {
      authService.findOne = jest.fn().mockReturnValue(null);
      const app = new App([authRoute]);
      const server = app.getServer();
      const res = await request(server).post(`/signup`).send(invalidUserEmail);
      expect(res.status).toBe(400);
      expect(res.text).toBe(JSON.stringify({ message: 'email must be an email' }));
      return;
    });
    it('Should return invalid Password', async () => {
      authService.findOne = jest.fn().mockReturnValue(null);
      const app = new App([authRoute]);
      const server = app.getServer();
      const res = await request(server).post(`/signup`).send(invalidUserPass);
      expect(res.status).toBe(400);
      expect(res.text).toBe(JSON.stringify({ message: 'password must be longer than or equal to 9 characters' }));
      return;
    });
    it('Should return user data after signup', async () => {
      authService.findOne = jest.fn().mockReturnValue(null);
      authService.save = jest.fn().mockReturnValue({
        id: 1,
        email: userReq.email,
        password: await bcrypt.hash(userReq.password, 10),
      });
      const app = new App([authRoute]);
      const server = app.getServer();
      return request(server).post(`/signup`).send(userReq).expect(201);
    });
    it('Should return user data is Existed', async () => {
      authService.findOne = jest.fn().mockReturnValue(null);
      authService.save = jest.fn().mockReturnValue({
        id: 1,
        email: userReq.email,
        password: await bcrypt.hash(userReq.password, 10),
      });
      const app = new App([authRoute]);
      const server = app.getServer();
      const sendRequest = request(server).post(`/signup`).send(userReq);
      return sendRequest.expect(409);
    });
  });
  describe('[Login account]', () => {
    const user: CreateUserDto = {
      email: 'testing@gmail.com',
      password: '123456789',
    };
    const userFailed: CreateUserDto = {
      email: 'testin123g@gmail.com',
      password: '123456789',
    };
    const authRoute = new AuthRoute();
    const authService = Container.get(AuthService);
    it('Should return login success', async () => {
      authService.findOne = jest.fn().mockReturnValue({
        id: 1,
        email: user.email,
        password: await bcrypt.hash(user.password, 10),
      });
      const app = new App([authRoute]);
      const server = app.getServer();
      const res = await request(server).post(`/login`).send(user);

      expect(res.status).toBe(200);
      expect(res.get('Set-Cookie')[0]).toMatch(/^Authorization=.+/);
      return;
    });
    it('Should return login failed', async () => {
      authService.findOne = jest.fn().mockReturnValue(null);
      const app = new App([authRoute]);
      const server = app.getServer();
      const res = await request(server).post(`/login`).send(userFailed);
      expect(res.status).toBe(409);
      return;
    });
  });
});
