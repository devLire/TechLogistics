import { Request, Response } from 'express';
import { prisma } from '../../data/posgres';
import { GetAccesosBiometricosDto } from '../../domain/dtos/accesos_biometricos';
import { formatErrors } from '../utils/formatErrors';

export class AccesosBiometricosController {
  constructor() {}

  public getAccesosBiometricos = async (req: Request, res: Response) => {
    const { page = 1, limit = 10, search = '' } = req.query;

    const [errors, getAccesosBiometricosDto] = GetAccesosBiometricosDto.create(
      +page,
      +limit
    );

    if (errors) {
      return res.status(400).json({
        status: 'fail',
        message: 'Los datos proporcionados no son válidos.',
        errors: formatErrors(errors),
      });
    }

    try {
      const whereClause: any = {};

      if (search) {
        whereClause.OR = [
          {
            usuario: {
              nombre: {
                contains: String(search),
                mode: 'insensitive',
              },
            },
          },
          {
            usuario: {
              email: {
                contains: String(search),
                mode: 'insensitive',
              },
            },
          },
          {
            dispositivo_autorizado: {
              dispositivo_id: {
                contains: String(search),
                mode: 'insensitive',
              },
            },
          },
        ];
      }

      const [dispositivos, total] = await Promise.all([
        prisma.acceso_Biometrico.findMany({
          where: whereClause,
          skip:
            (getAccesosBiometricosDto!.page - 1) *
            getAccesosBiometricosDto!.limit,
          take: getAccesosBiometricosDto!.limit,

          select: {
            id_acceso_biometrico: true,
            usuario: {
              select: {
                id_usuario: true,
                nombre: true,
              },
            },
            dispositivo_autorizado: {
              select: {
                id_dispositivo_autorizado: true,
                nombre_dispositivo: true,
              },
            },
            fecha_hora: true,
            estado: true,
          },
        }),

        prisma.acceso_Biometrico.count({
          where: whereClause,
        }),
      ]);

      const hasNext =
        getAccesosBiometricosDto!.page * getAccesosBiometricosDto!.limit <
        total;

      const searchParam = search
        ? `&search=${encodeURIComponent(String(search))}`
        : '';

      return res.json({
        status: 'success',
        message: 'Accesos biométricos obtenidos correctamente',
        data: dispositivos,

        pagination: {
          page: getAccesosBiometricosDto!.page,
          limit: getAccesosBiometricosDto!.limit,
          total,

          next: hasNext
            ? `/api/accesos-biometricos?page=${
                getAccesosBiometricosDto!.page + 1
              }&limit=${getAccesosBiometricosDto!.limit}${searchParam}`
            : null,

          prev:
            getAccesosBiometricosDto!.page > 1
              ? `/api/accesos-biometricos?page=${
                  getAccesosBiometricosDto!.page - 1
                }&limit=${getAccesosBiometricosDto!.limit}${searchParam}`
              : null,
        },
      });
    } catch (error: any) {
      console.error(error);

      return res.status(500).json({
        status: 'error',
        message: error.message || 'Error al obtener Accesos Biométricos',
        errors: formatErrors(error),
      });
    }
  };

  public getAnomalias = async (req: Request, res: Response) => {
    const { page = 1, limit = 10, search = '' } = req.query;

    const [errors, getAccesosBiometricosDto] = GetAccesosBiometricosDto.create(
      +page,
      +limit
    );

    if (errors) {
      return res.status(400).json({
        status: 'fail',
        message: 'Los datos proporcionados no son válidos.',
        errors: formatErrors(errors),
      });
    }

    try {
      const whereClause: any = {
        estado: 'DENEGADO',
      };

      if (search) {
        whereClause.OR = [
          {
            usuario: {
              nombre: {
                contains: String(search),
                mode: 'insensitive',
              },
            },
          },
          {
            usuario: {
              email: {
                contains: String(search),
                mode: 'insensitive',
              },
            },
          },
          {
            dispositivo_autorizado: {
              dispositivo_id: {
                contains: String(search),
                mode: 'insensitive',
              },
            },
          },
        ];
      }

      const [anomalias, total] = await Promise.all([
        prisma.acceso_Biometrico.findMany({
          where: whereClause,
          orderBy: {
            fecha_hora: 'desc',
          },
          skip:
            (getAccesosBiometricosDto!.page - 1) *
            getAccesosBiometricosDto!.limit,
          take: getAccesosBiometricosDto!.limit,
          select: {
            id_acceso_biometrico: true,
            fecha_hora: true,
            estado: true,
            dispositivo_autorizado: {
              select: {
                dispositivo_id: true,
                nombre_dispositivo: true,
              },
            },
            usuario: {
              select: {
                id_usuario: true,
                nombre: true,
                rol: true,
              },
            },
          },
        }),

        prisma.acceso_Biometrico.count({
          where: whereClause,
        }),
      ]);

      const hasNext =
        getAccesosBiometricosDto!.page * getAccesosBiometricosDto!.limit <
        total;

      const searchParam = search
        ? `&search=${encodeURIComponent(String(search))}`
        : '';

      return res.status(200).json({
        status: 'success',
        message: 'Registro de anomalías obtenido correctamente',
        data: anomalias,
        pagination: {
          page: getAccesosBiometricosDto!.page,
          limit: getAccesosBiometricosDto!.limit,
          total,
          next: hasNext
            ? `/api/anomalias?page=${
                getAccesosBiometricosDto!.page + 1
              }&limit=${getAccesosBiometricosDto!.limit}${searchParam}`
            : null,
          prev:
            getAccesosBiometricosDto!.page > 1
              ? `/api/anomalias?page=${
                  getAccesosBiometricosDto!.page - 1
                }&limit=${getAccesosBiometricosDto!.limit}${searchParam}`
              : null,
        },
      });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Error al obtener el historial de anomalías',
        errors: formatErrors(error),
      });
    }
  };

  public verificarAccesoBiometrico = async (req: Request, res: Response) => {
    const { id_usuario, dispositivo_id } = req.body ?? {};

    if (!id_usuario || !dispositivo_id) {
      return res.status(400).json({
        status: 'fail',
        message: 'El id_usuario y dispositivo_id son requeridos.',
        errors: formatErrors(null),
      });
    }

    try {
      const dispositivo = await prisma.dispositivo_Autorizado.findUnique({
        where: { dispositivo_id: String(dispositivo_id) },
      });

      const esValido =
        dispositivo &&
        dispositivo.id_usuario === Number(id_usuario) &&
        dispositivo.activo;

      if (!esValido) {
        if (dispositivo) {
          await prisma.acceso_Biometrico.create({
            data: {
              id_usuario: Number(id_usuario),
              id_dispositivo_autorizado: dispositivo.id_dispositivo_autorizado,
              estado: 'DENEGADO',
            },
          });
        }

        console.log(
          '\n[ALERTA DE SEGURIDAD] - Intento de acceso desde dispositivo no autorizado o bloqueado.'
        );

        return res.status(403).json({
          status: 'fail',
          message:
            'Acceso denegado. El dispositivo no está autorizado, pertenece a otro usuario o está inactivo.',
          errors: formatErrors(null),
        });
      }

      await prisma.acceso_Biometrico.create({
        data: {
          id_usuario: Number(id_usuario),
          id_dispositivo_autorizado: dispositivo.id_dispositivo_autorizado,
          estado: 'PERMITIDO',
        },
      });

      console.log('\n==================================================');
      console.log(`[TINKERCAD SERIAL] - ORDEN DE APERTURA ENVIADA`);
      console.log(`Operario ID: ${id_usuario}`);
      console.log(`Dispositivo: ${dispositivo.nombre_dispositivo}`);
      console.log(`Hora: ${new Date().toLocaleTimeString()}`);
      console.log('==================================================\n');

      return res.status(200).json({
        status: 'success',
        message: 'Acceso biométrico autorizado. Abriendo cerradura.',
      });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        status: 'error',
        message:
          error.message ||
          'Error interno al procesar la verificación biométrica.',
        errors: formatErrors(error),
      });
    }
  };
}
