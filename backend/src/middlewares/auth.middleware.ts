import { NextFunction, Request, Response } from 'express';
import { JwtAdapter } from '../config/jwt.adapter';
import { prisma } from '../data/posgres';

export class AuthMiddleware {
  static async validateJWT(req: Request, res: Response, next: NextFunction) {
    const authorization = req.header('Authorization');

    if (!authorization)
      return res.status(401).json({
        status: 'fail',
        message: 'No se proporcionó un token',
        errors: null,
      });
    if (!authorization.startsWith('Bearer '))
      return res.status(401).json({
        status: 'fail',
        message: 'Token Bearer inválido',
        errors: null,
      });

    // Extraemos el token quitando la palabra "Bearer "
    const token = authorization.split(' ')[1] || '';

    try {
      // Validamos el token y extraemos el payload (que será el id_usuario)
      const payload = await JwtAdapter.validateToken<{ id: number }>(token);
      if (!payload)
        return res.status(401).json({
          status: 'fail',
          message: 'Token no válido o expirado',
          errors: null,
        });

      // Verificamos que el usuario del token siga existiendo y esté activo en la BD
      const user = await prisma.usuario.findUnique({
        where: { id_usuario: payload.id },
      });

      if (!user)
        return res
          .status(401)
          .json({ error: 'Token no válido - usuario no existe' });
      if (!user.activo)
        return res.status(401).json({
          status: 'fail',
          message: 'El usuario está inactivo',
          errors: null,
        });

      // Inyectamos el usuario en el request para que el controlador lo pueda usar
      (req as any).user = user;

      // Todo está correcto, dejamos pasar la petición
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: error,
        message: 'Error interno del servidor',
        errors: null,
      });
    }
  }
}
