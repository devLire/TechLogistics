import { Router } from 'express';
import { AccesosBiometricosController } from './controller';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { RoleMiddleware } from '../../middlewares/role.middleware';

export class AccesosBiometricosRoutes {
  static get routes(): Router {
    const router = Router();
    const accesosBiometricosController = new AccesosBiometricosController();

    // Middlewares globales
    router.use(AuthMiddleware.validateJWT);
    router.use(RoleMiddleware.requireRoles(['SUPERVISOR']));

    router.get('/', accesosBiometricosController.getAccesosBiometricos);
    router.get('/anomalias', accesosBiometricosController.getAnomalias);

    router.post(
      '/verificar',
      accesosBiometricosController.verificarAccesoBiometrico
    );

    return router;
  }
}
