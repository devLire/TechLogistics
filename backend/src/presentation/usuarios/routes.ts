import { Router } from 'express';
import { UsuarioController } from './controller';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { RoleMiddleware } from '../../middlewares/role.middleware';

export class UsuariosRoutes {
  static get routes(): Router {
    const router = Router();
    const userController = new UsuarioController();

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
