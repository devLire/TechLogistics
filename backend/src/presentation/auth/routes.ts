import { Router } from 'express';
import { AuthController } from './controller';
import { AuthMiddleware } from '../../middlewares/auth.middleware';

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    const authController = new AuthController();

    router.post('/login', authController.loginUser);
    router.get(
      '/check-status',
      AuthMiddleware.validateJWT,
      authController.checkAuthStatusUser
    );

    return router;
  }
}
