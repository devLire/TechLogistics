import { Router } from 'express';
import { CategoriasController } from './controller';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { RoleMiddleware } from '../../middlewares/role.middleware';

export class CategoriasRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new CategoriasController();

    // Middlewares globales
    router.use(AuthMiddleware.validateJWT);
    router.use(RoleMiddleware.requireAdmin);

    router.get('/', controller.getCategorias);
    router.get('/:id', controller.getCategoriaByID);
    router.post('/', controller.createCategoria);
    router.put('/:id', controller.updateCategoria);
    router.delete('/:id', controller.deleteCategoria);

    return router;
  }
}
