import { Request, Response } from 'express';
import { prisma } from '../../data/posgres';
import {
  GetProveedoresDto,
  GetProveedorByIdDto,
  CreateProveedorDto,
  UpdateProveedorDto,
} from '../../domain/dtos';

export class ProveedorController {
  public getProveedores = async (req: Request, res: Response) => {
    const { page = 1, limit = 10, search = '' } = req.query;
    const [errors, getProveedoresDto] = GetProveedoresDto.create(+page, +limit);
    if (errors)
      return res.status(400).json({
        status: 'fail',
        message: 'Los datos proporcionados no son válidos.',
        errors,
      });

    try {
      const whereClause: any = {
        activo: true,
      };

      if (search) {
        whereClause.OR = [
          { nombre_empresa: { contains: String(search), mode: 'insensitive' } },
        ];
      }

      const [proveedores, total] = await Promise.all([
        prisma.proveedor.findMany({
          where: whereClause,
          skip: (getProveedoresDto!.page - 1) * getProveedoresDto!.limit,
          take: getProveedoresDto!.limit,
          select: {
            id_proveedor: true,
            nombre_empresa: true,
            contacto: true,
            telefono: true,
          },
        }),
        prisma.proveedor.count({ where: whereClause }),
      ]);

      const hasNext =
        getProveedoresDto!.page * getProveedoresDto!.limit < total;

      const searchParam = search
        ? `&search=${encodeURIComponent(String(search))}`
        : '';

      return res.json({
        status: 'success',
        message: 'Proveedores obtenidos correctamente',
        data: proveedores,
        pagination: {
          page: getProveedoresDto!.page,
          limit: getProveedoresDto!.limit,
          total,
          next: hasNext
            ? `/api/proveedores?page=${getProveedoresDto!.page + 1}&limit=${getProveedoresDto!.limit}${searchParam}`
            : null,
          prev:
            getProveedoresDto!.page > 1
              ? `/api/proveedores?page=${getProveedoresDto!.page - 1}&limit=${getProveedoresDto!.limit}${searchParam}`
              : null,
        },
      });
    } catch (e) {
      return res.status(500).json({
        status: 'error',
        message: 'Error al obtener proveedores',
        errors: null,
      });
    }
  };

  public getProveedorByID = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const [errors, getProveedorByIdDto] = GetProveedorByIdDto.create(id);
    if (errors)
      return res.status(400).json({
        status: 'fail',
        message: 'Los datos proporcionados no son válidos.',
        errors,
      });

    try {
      const proveedor = await prisma.proveedor.findUnique({
        where: { id_proveedor: getProveedorByIdDto!.id },
        select: {
          id_proveedor: true,
          nombre_empresa: true,
          contacto: true,
          telefono: true,
        },
      });

      if (!proveedor) {
        return res.status(404).json({
          status: 'fail',
          message: `Proveedor with ID ${id} not found`,
          errors: null,
        });
      }

      return res.json({
        status: 'success',
        message: 'Proveedor obtenido correctamente',
        data: proveedor,
      });
    } catch (e) {
      return res.status(500).json({
        status: 'error',
        message: 'Error al obtener proveedores',
        errors: null,
      });
    }
  };

  public createProveedor = async (req: Request, res: Response) => {
    const [errors, createProveedorDto] = CreateProveedorDto.create(req.body);

    if (errors)
      return res.status(400).json({
        status: 'fail',
        message: 'Los datos proporcionados no son válidos.',
        errors,
      });

    try {
      const existingProveedor = await prisma.proveedor.findFirst({
        where: { nombre_empresa: createProveedorDto!.nombre_empresa },
      });

      if (existingProveedor) {
        return res.status(400).json({
          status: 'fail',
          message: 'El nombre de la empresa ya existe',
          errors: null,
        });
      }

      const proveedor = await prisma.proveedor.create({
        data: {
          nombre_empresa: createProveedorDto!.nombre_empresa,
          contacto: createProveedorDto!.contacto,
          telefono: createProveedorDto!.telefono,
          activo: true,
        },
        select: {
          id_proveedor: true,
          nombre_empresa: true,
          contacto: true,
          telefono: true,
        },
      });

      return res.status(201).json({
        status: 'success',
        message: 'Proveedor creado correctamente',
        data: proveedor,
      });
    } catch (e) {
      return res.status(500).json({
        status: 'error',
        message: 'Error al crear proveedores en el servidor',
        errors: null,
      });
    }
  };

  public updateProveedor = async (req: Request, res: Response) => {
    const id = +req.params.id;

    const [errors, updateProveedorDto] = UpdateProveedorDto.create({
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
      const exists = await prisma.proveedor.findUnique({
        where: { id_proveedor: id },
      });

      if (!exists) {
        return res.status(404).json({
          status: 'fail',
          message: `Proveedor with ID ${id} not found`,
          errors: null,
        });
      }

      if (updateProveedorDto?.nombre_empresa) {
        const existingProveedor = await prisma.proveedor.findFirst({
          where: {
            nombre_empresa: updateProveedorDto!.nombre_empresa,
            NOT: { id_proveedor: updateProveedorDto!.id },
          },
        });

        if (existingProveedor) {
          return res.status(400).json({
            status: 'fail',
            message: 'El nombre de la empresa ya existe',
            errors: null,
          });
        }
      }

      const proveedor = await prisma.proveedor.update({
        where: { id_proveedor: id },
        data: updateProveedorDto!.values,
        select: {
          id_proveedor: true,
          nombre_empresa: true,
          contacto: true,
          telefono: true,
        },
      });

      return res.json({
        status: 'success',
        message: 'Proveedor actualizado correctamente',
        data: proveedor,
      });
    } catch (e) {
      return res.status(500).json({
        status: 'error',
        message: 'Error al actualizar proveedores',
        errors: null,
      });
    }
  };

  public deleteProveedor = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const [errors, getProveedorByIdDto] = GetProveedorByIdDto.create(id);

    if (errors)
      return res.status(400).json({
        status: 'fail',
        message: 'Los datos proporcionados no son válidos.',
        errors,
      });

    try {
      const exists = await prisma.proveedor.findUnique({
        where: { id_proveedor: getProveedorByIdDto!.id },
      });

      if (!exists) {
        return res.status(404).json({
          status: 'fail',
          message: `Proveedor with ID ${getProveedorByIdDto!.id} not found`,
          errors: null,
        });
      }

      const proveedor = await prisma.proveedor.update({
        where: { id_proveedor: getProveedorByIdDto!.id },
        data: { activo: false },
        select: {
          id_proveedor: true,
          nombre_empresa: true,
          contacto: true,
          telefono: true,
        },
      });

      return res.json({
        status: 'success',
        message: 'Proveedor eliminado correctamente',
        data: proveedor,
      });
    } catch (e) {
      return res.status(500).json({
        status: 'error',
        message: 'Error al eliminar proveedores',
        errors: null,
      });
    }
  };
}
