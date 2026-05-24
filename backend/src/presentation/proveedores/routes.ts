import { Router } from 'express';
import { ProveedorController } from './controller';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { RoleMiddleware } from '../../middlewares/role.middleware';

export class ProveedoresRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new ProveedorController();

    // Middlewares globales
    router.use(AuthMiddleware.validateJWT);
    router.use(RoleMiddleware.requireAdmin);

    router.get('/', controller.getProveedores);
    router.get('/:id', controller.getProveedorByID);
    router.post('/', controller.createProveedor);
    router.put('/:id', controller.updateProveedor);
    router.delete('/:id', controller.deleteProveedor);

    return router;
  }
}
