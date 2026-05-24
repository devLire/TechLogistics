import { Router } from 'express';
import { MovimientosIngresoController } from './controller';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { RoleMiddleware } from '../../middlewares/role.middleware';

export class MovimientosIngresosRoutes {
  static get routes(): Router {
    const router = Router();
    const movimientosIngresos = new MovimientosIngresoController();

    // Middleware global:
    router.use(AuthMiddleware.validateJWT);

    // OPERARIO y SUPERVISOR pueden registrar un ingreso de mercadería
    router.post(
      '/',
      RoleMiddleware.requireRoles(['OPERARIO', 'SUPERVISOR']),
      movimientosIngresos.createMovimientoIngreso
    );

    // OPERARIO, SUPERVISOR y ADMINISTRADOR pueden ver la lista de ingresos
    router.get(
      '/',
      RoleMiddleware.requireRoles(['OPERARIO', 'SUPERVISOR', 'ADMINISTRADOR']),
      movimientosIngresos.getMovimientosIngreso
    );

    // A partir de aquí, solo jerarquías más altas (ADMINISTRADOR o SUPERVISOR) pueden ver por ID
    router.get(
      '/:id',
      RoleMiddleware.requireRoles(['SUPERVISOR', 'ADMINISTRADOR']),
      movimientosIngresos.getMovimientoIngresoByID
    );

    return router;
  }
}
