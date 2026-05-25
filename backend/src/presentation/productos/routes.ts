import { Router } from 'express';
import { ProductosController } from './controller';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { RoleMiddleware } from '../../middlewares/role.middleware';

export class ProductosRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new ProductosController();

    // Middlewares globales
    router.use(AuthMiddleware.validateJWT);

    router.get(
      '/',
      RoleMiddleware.requireRoles(['OPERARIO', 'SUPERVISOR']),
      controller.getProductos
    );
    router.get(
      '/alertas',
      RoleMiddleware.requireRoles(['OPERARIO', 'SUPERVISOR']),
      controller.getAlertasStock
    );

    // El resto solo ADMIN
    router.use(RoleMiddleware.requireAdmin);

    router.get('/:id', controller.getProductoByID);
    router.post('/', controller.createProducto);
    router.put('/:id', controller.updateProducto);
    router.delete('/:id', controller.deleteProducto);

    return router;
  }
}
