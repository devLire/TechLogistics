import { Router } from 'express';
import { MovimientosSalidaController } from './controller';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { RoleMiddleware } from '../../middlewares/role.middleware';

export class MovimientosSalidaRoutes {
  static get routes(): Router {
    const router = Router();
    const movimientosSalidas = new MovimientosSalidaController();

    // Middleware global
    router.use(AuthMiddleware.validateJWT);

    // El OPERARIO en campo o el SUPERVISOR pueden despachar productos (Salidas)
    router.post(
      '/',
      RoleMiddleware.requireRoles(['OPERARIO', 'SUPERVISOR']),
      movimientosSalidas.createMovimientoSalida
    );

    // Todos los roles autorizados pueden listar los despachos
    router.get(
      '/',
      RoleMiddleware.requireRoles(['OPERARIO', 'SUPERVISOR', 'ADMINISTRADOR']),
      movimientosSalidas.getMovimientosSalida
    );

    // Solo el SUPERVISOR y el ADMINISTRADOR pueden auditar el detalle de un despacho específico
    router.get(
      '/:id',
      RoleMiddleware.requireRoles(['SUPERVISOR', 'ADMINISTRADOR']),
      movimientosSalidas.getMovimientoSalidaByID
    );

    return router;
  }
}
