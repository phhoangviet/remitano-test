import { AuthController } from '@/controllers/auth.controller';
import { CreateUserDto } from '@/dtos/user.dto';
import { Routes } from '@/interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { ValidationMiddleware } from '@/middlewares/validate.middleware';
import { Router } from 'express';

export class AuthRoute implements Routes {
  public router = Router();
  public auth = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/signup', ValidationMiddleware(CreateUserDto), this.auth.signUp);
    this.router.post('/login', ValidationMiddleware(CreateUserDto), this.auth.logIn);
    this.router.post('/logout', AuthMiddleware, this.auth.logOut);
  }
}
