import { Router } from 'express';
import { SeedController } from './controller';

export class SeedRoutes {
  static get routes(): Router {
    const router = Router();
    const seedController = new SeedController();

    router.post('/', seedController.runSeed);
    router.get('/', seedController.runSeed);

    return router;
  }
}
