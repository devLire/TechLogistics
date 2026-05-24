import { Request, Response } from 'express';
import { prisma } from '../../data/posgres';
import {
  CreateIngresoDto,
  GetIngresoByIdDto,
  GetIngresosDto,
} from '../../domain/dtos';

export class IngresosController {
  public getIngresos = async (req: Request, res: Response) => {
    const { page = 1, limit = 10, search = '' } = req.query;
    const [errors, getIngresosDto] = GetIngresosDto.create(+page, +limit);

    if (errors)
      return res.status(400).json({
        status: 'fail',
        message: 'Los datos proporcionados no son vlidos.',
        errors,
      });

    try {
      const whereClause: any = {};
      if (search) {
        whereClause.OR = [
          { producto: { nombre: { contains: String(search), mode: 'insensitive' } } },
          { usuario: { nombre: { contains: String(search), mode: 'insensitive' } } },
        ];
      }

      const [ingresos, total] = await Promise.all([
        prisma.ingreso_inventario.findMany({
          where: whereClause,
          skip: (getIngresosDto!.page - 1) * getIngresosDto!.limit,
          take: getIngresosDto!.limit,
          select: {
            id_inventario: true,
            id_producto: true,
            id_usuario: true,
            cantidad_ingresada: true,
            fecha_ingreso: true,
            producto: {
              select: {
                id_producto: true,
                nombre: true,
                proveedor: {
                  select: { nombre_empresa: true },
                },
              },
            },
            usuario: {
              select: { id_usuario: true, nombre: true },
            },
          },
          orderBy: { fecha_ingreso: 'desc' },
        }),
        prisma.ingreso_inventario.count({ where: whereClause }),
      ]);

      const hasNext = getIngresosDto!.page * getIngresosDto!.limit < total;

      const searchParam = search
        ? `&search=${encodeURIComponent(String(search))}`
        : '';

      return res.json({
        status: 'success',
        message: 'Ingresos obtenidos correctamente',
        data: ingresos,
        pagination: {
          page: getIngresosDto!.page,
          limit: getIngresosDto!.limit,
          total,
          next: hasNext
            ? `/api/ingresos?page=${getIngresosDto!.page + 1}&limit=${getIngresosDto!.limit}${searchParam}`
            : null,
          prev:
            getIngresosDto!.page > 1
              ? `/api/ingresos?page=${getIngresosDto!.page - 1}&limit=${getIngresosDto!.limit}${searchParam}`
              : null,
        },
      });
    } catch (e) {
      return res.status(500).json({
        status: 'error',
        message: 'Error al obtener ingresos',
        errors: null,
        e: e,
      });
    }
  };

  public getIngresoByID = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const [errors, getIngresoByIdDto] = GetIngresoByIdDto.create(id);

    if (errors)
      return res.status(400).json({
        status: 'fail',
        message: 'Los datos proporcionados no son válidos.',
        errors,
      });

    try {
      const ingreso = await prisma.ingreso_inventario.findUnique({
        where: { id_inventario: getIngresoByIdDto!.id },
        select: {
          id_inventario: true,
          id_producto: true,
          id_usuario: true,
          cantidad_ingresada: true,
          fecha_ingreso: true,
          producto: {
            select: { id_producto: true, nombre: true },
          },
          usuario: {
            select: { id_usuario: true, nombre: true },
          },
        },
      });

      if (!ingreso) {
        return res.status(404).json({
          status: 'fail',
          message: `Ingreso with ID ${id} not found`,
          errors: null,
        });
      }

      return res.json({
        status: 'success',
        message: 'Ingreso obtenido correctamente',
        data: ingreso,
      });
    } catch (e) {
      return res.status(500).json({
        status: 'error',
        message: 'Error al obtener ingreso',
        errors: null,
      });
    }
  };

  public createIngreso = async (req: Request, res: Response) => {
    const [errors, createIngresoDto] = CreateIngresoDto.create(req.body);

    if (errors) return res.status(400).json({ status: 'fail', errors });

    try {
      const result = await prisma.$transaction(async (tx) => {
        // 1. Verificar que el producto exista
        const producto = await tx.producto.findUnique({
          where: { id_producto: createIngresoDto!.id_producto },
        });

        if (!producto || !producto.activo) {
          throw new Error('Producto no encontrado o inactivo');
        }

        if (createIngresoDto!.id_usuario) {
          const usuarioExists = await tx.usuario.findUnique({
            where: {
              id_usuario: createIngresoDto!.id_usuario,
            },
          });

          if (!usuarioExists || !usuarioExists.activo) {
            throw new Error(
              'El usuario seleccionado no es válido o está inactivo.'
            );
          }
        }

        // 2. Registrar el ingreso en la tabla Ingreso_inventario
        const nuevoIngreso = await tx.ingreso_inventario.create({
          data: {
            id_producto: createIngresoDto!.id_producto,
            id_usuario: createIngresoDto!.id_usuario,
            cantidad_ingresada: createIngresoDto!.cantidad_ingresada,
          },
          select: {
            id_inventario: true,
            id_producto: true,
            id_usuario: true,
            cantidad_ingresada: true,
            fecha_ingreso: true,
            producto: {
              select: { nombre: true, stock_actual: true },
            },
            usuario: {
              select: { nombre: true },
            },
          },
        });

        // 3. ACTUALIZAR EL STOCK (Aumentar)
        await tx.producto.update({
          where: { id_producto: createIngresoDto!.id_producto },
          data: {
            stock_actual: { increment: createIngresoDto!.cantidad_ingresada },
          },
        });

        nuevoIngreso.producto!.stock_actual +=
          createIngresoDto!.cantidad_ingresada;

        return nuevoIngreso;
      });

      return res.status(201).json({
        status: 'success',
        message: 'Stock actualizado correctamente',
        data: result,
      });
    } catch (e: any) {
      return res
        .status(400)
        .json({
          status: 'fail',
          message: e.message || 'Error al procesar el ingreso.',
        });
    }
  };
}
