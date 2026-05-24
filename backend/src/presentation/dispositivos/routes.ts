import { Router } from 'express';
import { DispositivoController } from './controller';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { RoleMiddleware } from '../../middlewares/role.middleware';

export class DispositivosRoutes {
  static get routes(): Router {
    const router = Router();
    const dispositivoController = new DispositivoController();

    // Middlewares globales
    router.use(AuthMiddleware.validateJWT);
    router.use(RoleMiddleware.requireAdmin);

    router.get('/', dispositivoController.getDispositivos);
    router.get('/:id', dispositivoController.getDispositivoById);
    router.get('/user/:id', dispositivoController.getDispositivosByUserId);

    router.post('/', dispositivoController.registerDispositivo);
    router.put('/:id', dispositivoController.updateDispositivo);
    router.delete('/:id', dispositivoController.deleteDispositivo);

    return router;
  }
}
