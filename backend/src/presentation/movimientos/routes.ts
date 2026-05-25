import { Router } from 'express';
import { MovimientosController } from './controller';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { RoleMiddleware } from '../../middlewares/role.middleware';

export class MovimientosRoutes {
  static get routes(): Router {
    const router = Router();
    const movimientosController = new MovimientosController();

    // Middleware global: Todos deben estar autenticados
    router.use(AuthMiddleware.validateJWT);

    // OPERARIO y SUPERVISOR pueden registrar ingresos y salidas
    router.post(
      '/',
      RoleMiddleware.requireRoles(['OPERARIO', 'SUPERVISOR']),
      movimientosController.createMovimiento
    );

    // Todos los roles autorizados pueden listar el historial global o filtrado
    router.get(
      '/',
      RoleMiddleware.requireRoles(['OPERARIO', 'SUPERVISOR', 'ADMINISTRADOR']),
      movimientosController.getMovimientos
    );

    // Solo roles administrativos pueden auditar detalles por ID
    router.get(
      '/:id',
      RoleMiddleware.requireRoles(['SUPERVISOR', 'ADMINISTRADOR']),
      movimientosController.getMovimientoByID
    );

    return router;
  }
}
