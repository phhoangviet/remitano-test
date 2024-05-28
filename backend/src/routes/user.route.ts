import { UserController } from '@/controllers/user.controller';
import { UserShareYoutubeDto } from '@/dtos/user.dto';
import { Routes } from '@/interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { ValidationMiddleware } from '@/middlewares/validate.middleware';
import { Router } from 'express';

export class UserRoute implements Routes {
  public router = Router();
  public path = '/users';
  public userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/share`, [AuthMiddleware, ValidationMiddleware(UserShareYoutubeDto)], this.userController.handleShare);
    this.router.get(`${this.path}/share-by-me`, [AuthMiddleware, ValidationMiddleware(UserShareYoutubeDto)], this.userController.getMyShared);
    this.router.get(
      `${this.path}/share-by-others`,
      [AuthMiddleware, ValidationMiddleware(UserShareYoutubeDto)],
      this.userController.getSharedByOther,
    );
    // this.router.post('/login', ValidationMiddleware(CreateUserDto), this.auth.logIn);
    // this.router.post('/logout', AuthMiddleware, this.auth.logOut);
  }
}
