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

    // CAJERO e INVENTARIO pueden ver los productos
    router.get('/', RoleMiddleware.requireRoles(['CAJERO', 'INVENTARIO']), controller.getProductos);
    router.get('/alertas', RoleMiddleware.requireRoles(['CAJERO', 'INVENTARIO']), controller.getAlertasStock);

    // El resto solo ADMIN
    router.use(RoleMiddleware.requireAdmin);

    router.get('/:id', controller.getProductoByID);
    router.post('/', controller.createProducto);
    router.put('/:id', controller.updateProducto);
    router.delete('/:id', controller.deleteProducto);

    return router;
  }
}
