import { Request, Response } from 'express';
import { prisma } from '../../data/posgres';
import { JwtAdapter } from '../../config/jwt.adapter';
import { LoginUserDto } from '../../domain/dtos/auth/login-user.dto';

export class AuthController {
  public loginUser = async (req: Request, res: Response) => {
    const [errors, loginDto] = LoginUserDto.create(req.body);

    if (errors)
      return res.status(400).json({
        status: 'fail',
        message: 'Los datos proporcionados no son válidos.',
        errors,
      });

    try {
      // Verificar si el correo existe
      const user = await prisma.usuario.findUnique({
        where: { email: loginDto!.email },
      });

      if (!user || !user.activo) {
        return res.status(400).json({
          status: 'fail',
          message: 'Credenciales incorrectas',
          errors: null,
        });
      }

      // Verificar contraseña
      if (loginDto!.password !== user.password) {
        return res
          .status(400)
          .json({ status: 'fail', message: 'Credenciales incorrectas' });
      }

      // Generar el JWT usando el ID del usuario
      const token = await JwtAdapter.generateToken({ id: user.id_usuario });
      if (!token)
        return res.status(500).json({
          status: 'fail',
          message: 'Error al generar el token',
          errors: null,
        });

      // Devolvemos el usuario y el token
      const { password, activo, ...userEntity } = user;

      return res.json({
        status: 'success',
        user: userEntity,
        token: token,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor',
        errors: null,
      });
    }
  };

  public checkAuthStatusUser = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { password, ...userEntity } = user;

    // Generamos un nuevo token para refrescar la sesión del usuario
    const token = await JwtAdapter.generateToken({ id: user.id_usuario });

    return res.json({
      status: 'success',
      user: userEntity,
      token: token,
    });
  };
}
