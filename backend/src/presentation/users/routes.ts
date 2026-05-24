import { Router } from 'express';
import { UserController } from './controller';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { RoleMiddleware } from '../../middlewares/role.middleware';

export class UserRoutes {
  static get routes(): Router {
    const router = Router();
    const userController = new UserController();

    // Middlewares globales
    router.use(AuthMiddleware.validateJWT);
    router.use(RoleMiddleware.requireAdmin);

    router.get('/', userController.getUsers);
    router.get('/:id', userController.getUserByID);

    router.post('/', userController.createUser);
    router.put('/:id', userController.updateUser);
    router.delete('/:id', userController.deleteUser);

    return router;
  }
}
