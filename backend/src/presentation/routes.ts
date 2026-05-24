import { Router } from 'express';
import { UserRoutes } from './users/routes';
import { AuthRoutes } from './auth/routes';
import { ProveedoresRoutes } from './proveedores/routes';
import { CategoriasRoutes } from './categorias/routes';
import { ProductosRoutes } from './productos/routes';
import { VentasRoutes } from './ventas/routes';
import { IngresosRoutes } from './ingresos/routes';
import { SeedRoutes } from './seed/routes';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use('/api/users', UserRoutes.routes);
    router.use('/api/auth', AuthRoutes.routes);
    router.use('/api/proveedores', ProveedoresRoutes.routes);
    router.use('/api/categorias', CategoriasRoutes.routes);
    router.use('/api/productos', ProductosRoutes.routes);
    router.use('/api/ventas', VentasRoutes.routes);
    router.use('/api/ingresos', IngresosRoutes.routes);
    router.use('/api/seed', SeedRoutes.routes);

    return router;
  }
}
