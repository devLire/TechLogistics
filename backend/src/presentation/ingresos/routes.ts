import { Router } from 'express';
import { IngresosController } from './controller';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { RoleMiddleware } from '../../middlewares/role.middleware';

export class IngresosRoutes {
  static get routes(): Router {
    const router = Router();
    const ingresosController = new IngresosController();

    // Middlewares globales
    router.use(AuthMiddleware.validateJWT);

    // INVENTARIO puede registrar un ingreso
    router.post('/', RoleMiddleware.requireRoles(['INVENTARIO']), ingresosController.createIngreso);

    // CAJERO e INVENTARIO pueden ver los ingresos
    router.get('/', RoleMiddleware.requireRoles(['CAJERO', 'INVENTARIO']), ingresosController.getIngresos);

    // El resto solo ADMIN
    router.use(RoleMiddleware.requireAdmin);

    router.get('/:id', ingresosController.getIngresoByID);

    return router;
  }
}
