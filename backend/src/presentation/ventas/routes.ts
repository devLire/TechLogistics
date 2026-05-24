import { Router } from 'express';
import { VentasController } from './controller';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { RoleMiddleware } from '../../middlewares/role.middleware';

export class VentasRoutes {
  static get routes(): Router {
    const router = Router();
    const ventasController = new VentasController();

    // Middlewares globales
    router.use(AuthMiddleware.validateJWT);

    // CAJERO puede registrar una venta
    router.post('/', RoleMiddleware.requireRoles(['CAJERO']), ventasController.createVenta);

    // CAJERO e INVENTARIO pueden ver las ventas
    router.get('/', RoleMiddleware.requireRoles(['CAJERO', 'INVENTARIO']), ventasController.getVentas);

    // El resto solo ADMIN
    router.use(RoleMiddleware.requireAdmin);

    router.get('/:id', ventasController.getVentaByID);
    router.put('/:id', ventasController.updateVenta);

    return router;
  }
}
