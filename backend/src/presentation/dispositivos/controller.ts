import { Request, Response } from 'express';
import { prisma } from '../../data/posgres';
import {
  GetDispositivosDto,
  GetDispositivosByUserIdDto,
  RegisterDispositivoDto,
  UpdateDispositivoDto,
  GetDispositivoByIdDto,
} from '../../domain/dtos/dispositivos';
import { formatErrors } from '../utils/formatErrors';

export class DispositivoController {
  constructor() {}

  public getDispositivos = async (req: Request, res: Response) => {
    const { page = 1, limit = 10, search = '', estado = 'ACTIVOS' } = req.query;
    const [errors, getDispositivosDto] = GetDispositivosDto.create(
      +page,
      +limit,
      estado as string
    );
    if (errors)
      return res.status(400).json({
        status: 'fail',
        message: 'Los datos proporcionados no son válidos.',
        errors: formatErrors(errors),
      });
    try {
      const whereClause: any = {};
      if (getDispositivosDto!.estado === 'ACTIVOS') {
        whereClause.activo = true;
      } else if (getDispositivosDto!.estado === 'INACTIVOS') {
        whereClause.activo = false;
      }

      if (search) {
        whereClause.OR = [
          { nombre: { contains: String(search), mode: 'insensitive' } },
          { email: { contains: String(search), mode: 'insensitive' } },
        ];
      }

      const [dispositivos, total] = await Promise.all([
        prisma.dispositivo_Autorizado.findMany({
          where: whereClause,
          skip: (getDispositivosDto!.page - 1) * getDispositivosDto!.limit,
          take: getDispositivosDto!.limit,
          select: {
            id_dispositivo_autorizado: true,
            usuario: {
              select: {
                id_usuario: true,
                nombre: true,
              },
            },
            dispositivo_id: true,
            nombre_dispositivo: true,
            fecha_registro: true,
          },
        }),
        prisma.dispositivo_Autorizado.count({ where: whereClause }),
      ]);

      const hasNext =
        getDispositivosDto!.page * getDispositivosDto!.limit < total;

      const searchParam = search
        ? `&search=${encodeURIComponent(String(search))}`
        : '';
      const estadoParam =
        getDispositivosDto!.estado !== 'ACTIVOS'
          ? `&estado=${getDispositivosDto!.estado}`
          : '';

      return res.json({
        status: 'success',
        message: 'Dispositivos obtenidos correctamente',
        data: dispositivos,
        errors: formatErrors(null),
        pagination: {
          page: getDispositivosDto!.page,
          limit: getDispositivosDto!.limit,
          total,
          next: hasNext
            ? `/api/dispositivos?page=${getDispositivosDto!.page + 1}&limit=${getDispositivosDto!.limit}${searchParam}${estadoParam}`
            : null,
          prev:
            getDispositivosDto!.page > 1
              ? `/api/dispositivos?page=${getDispositivosDto!.page - 1}&limit=${getDispositivosDto!.limit}${searchParam}${estadoParam}`
              : null,
        },
      });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Error al obtener Dispositivos',
        errors: formatErrors(error),
      });
    }
  };

  public getDispositivosByUserId = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const [errors, dto] = GetDispositivosByUserIdDto.create(id);

    if (errors) {
      return res.status(400).json({
        status: 'fail',
        message: 'Los datos proporcionados no son válidos.',
        errors: formatErrors(errors),
      });
    }

    try {
      const usuario = await prisma.usuario.findUnique({
        where: {
          id_usuario: dto!.id_usuario,
        },
      });

      if (!usuario) {
        return res.status(404).json({
          status: 'fail',
          message: `User with id ${id} not found`,
          errors: formatErrors(null),
        });
      }

      const dispositivos = await prisma.dispositivo_Autorizado.findMany({
        where: {
          id_usuario: dto!.id_usuario,
        },
        select: {
          id_dispositivo_autorizado: true,
          usuario: {
            select: {
              id_usuario: true,
              nombre: true,
            },
          },
          dispositivo_id: true,
          nombre_dispositivo: true,
          fecha_registro: true,
        },
      });

      return res.status(200).json({
        status: 'success',
        message: 'Dispositivos del usuario obtenidos correctamente',
        data: dispositivos,
        errors: formatErrors(null),
      });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        status: 'error',
        message:
          error.message || 'Error al obtener los dispositivos del usuario',
        errors: formatErrors(error),
      });
    }
  };

  public getDispositivoById = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const [errors, getDispositivoById] = GetDispositivoByIdDto.create(id);

    if (errors)
      return res.status(400).json({
        status: 'fail',
        message: 'Los datos proporcionados no son válidos.',
        errors: formatErrors(errors),
      });

    try {
      const dispositivo = await prisma.dispositivo_Autorizado.findUnique({
        where: {
          id_dispositivo_autorizado: getDispositivoById!.id,
        },
        select: {
          id_dispositivo_autorizado: true,
          usuario: {
            select: {
              id_usuario: true,
              nombre: true,
            },
          },
          dispositivo_id: true,
          nombre_dispositivo: true,
          fecha_registro: true,
        },
      });

      if (!dispositivo) {
        return res.status(404).json({
          status: 'fail',
          message: `Dispositivo with ID ${id} not found`,
          errors: formatErrors(null),
        });
      }

      return res.json({
        status: 'success',
        message: 'Dispositivo obtenido correctamente',
        data: dispositivo,
        errors: formatErrors(null),
      });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Error al obtener dispositivo',
        errors: formatErrors(error),
      });
    }
  };

  public registerDispositivo = async (req: Request, res: Response) => {
    const [errors, registerDispositivoDto] = RegisterDispositivoDto.create(
      req.body
    );
    if (errors)
      return res.status(400).json({
        status: 'fail',
        message: 'Los datos proporcionados no son válidos.',
        errors: formatErrors(errors),
      });

    try {
      const usuario = await prisma.usuario.findUnique({
        where: { id_usuario: registerDispositivoDto!.id_usuario },
      });

      if (!usuario || !usuario.activo) {
        return res.status(400).json({
          status: 'fail',
          message: 'El usuario no es válido o se encuentra inactivo.',
          errors: formatErrors({
            id_usuario: 'Usuario no autorizado o inexistente.',
          }),
        });
      }

      const existingDispositivo =
        await prisma.dispositivo_Autorizado.findUnique({
          where: { dispositivo_id: registerDispositivoDto!.dispositivo_id },
        });

      if (existingDispositivo) {
        return res.status(400).json({
          status: 'fail',
          message: 'El dispositivo ya está registrado.',
          errors: formatErrors({
            dispositivo_id: 'El dispositivo ya está registrado.',
          }),
        });
      }

      const dispositivo = await prisma.dispositivo_Autorizado.create({
        data: {
          id_usuario: registerDispositivoDto!.id_usuario,
          dispositivo_id: registerDispositivoDto!.dispositivo_id,
          nombre_dispositivo: registerDispositivoDto!.nombre_dispositivo,
        },
        select: {
          dispositivo_id: true,
          nombre_dispositivo: true,
        },
      });
      res.status(201).json({
        status: 'success',
        message: 'Dispositivo registrado correctamente',
        data: dispositivo,
        errors: formatErrors(null),
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        status: 'error',
        message:
          error.message || 'Error al registrar el dispositivo en el servidor.',
        errors: formatErrors(error),
      });
    }
  };

  public updateDispositivo = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const [errors, updateDispositivoDto] = UpdateDispositivoDto.create({
      ...req.body,
      id,
    });

    if (errors)
      return res.status(400).json({
        status: 'fail',
        message: 'Los datos proporcionados no son válidos.',
        errors,
      });

    try {
      const dispositivo = await prisma.dispositivo_Autorizado.findUnique({
        where: { id_dispositivo_autorizado: id },
      });

      if (!dispositivo)
        return res.status(404).json({
          status: 'fail',
          message: `Dispositivo with ID ${id} not found`,
          errors: formatErrors(null),
        });

      const nuevoIdUsuario = updateDispositivoDto!.values.id_usuario;
      if (nuevoIdUsuario) {
        const usuario = await prisma.usuario.findUnique({
          where: { id_usuario: nuevoIdUsuario },
        });

        if (!usuario || usuario.activo === false) {
          return res.status(400).json({
            status: 'fail',
            message:
              'El usuario al que intenta asociar el dispositivo no es válido o está inactivo.',
            errors: formatErrors({
              id_usuario: 'Usuario no autorizado o inexistente.',
            }),
          });
        }
      }

      const updatedDispositivo = await prisma.dispositivo_Autorizado.update({
        where: {
          id_dispositivo_autorizado: id,
        },
        data: updateDispositivoDto!.values,
        select: {
          id_dispositivo_autorizado: true,
          usuario: {
            select: {
              id_usuario: true,
              nombre: true,
            },
          },
          dispositivo_id: true,
          nombre_dispositivo: true,
          fecha_registro: true,
        },
      });

      res.json({
        status: 'success',
        message: 'Dispositivo actualizado correctamente',
        data: updatedDispositivo,
        errors: formatErrors(null),
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        status: 'error',
        message: error.message || 'Error al actualizar dispositivo',
        errors: formatErrors(error),
      });
    }
  };
  public deleteDispositivo = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const [errors, getDispositivoByUser] = GetDispositivoByIdDto.create(id);
    if (errors)
      return res.status(400).json({
        status: 'fail',
        message: 'Los datos proporcionados no son válidos.',
        errors: formatErrors(errors),
      });

    try {
      const dispositivoExists = await prisma.dispositivo_Autorizado.findUnique({
        where: { id_dispositivo_autorizado: getDispositivoByUser!.id },
      });

      if (!dispositivoExists) {
        return res.status(404).json({
          status: 'fail',
          message: `Dispositivo with ID ${getDispositivoByUser!.id} not found`,
          errors: formatErrors(null),
        });
      }

      const deletedDispositivo = await prisma.dispositivo_Autorizado.update({
        where: {
          id_dispositivo_autorizado: getDispositivoByUser!.id,
        },
        data: {
          activo: false,
        },
        select: {
          id_dispositivo_autorizado: true,
          usuario: {
            select: {
              id_usuario: true,
              nombre: true,
            },
          },
          dispositivo_id: true,
          nombre_dispositivo: true,
          fecha_registro: true,
        },
      });
      return res.json({
        status: 'success',
        message: 'Dispositivo eliminado correctamente',
        data: deletedDispositivo,
        errors: formatErrors(null),
      });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Error al eliminar dispositivo',
        errors: formatErrors(error),
      });
    }
  };
}
