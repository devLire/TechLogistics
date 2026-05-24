import { Request, Response } from 'express';
import { prisma } from '../../data/posgres';
import {
  GetVentasDto,
  GetVentaByIdDto,
  CreateVentaDto,
  UpdateVentaDto,
} from '../../domain/dtos';

export class VentasController {
  public getVentas = async (req: Request, res: Response) => {
    const { page = 1, limit = 10, search = '' } = req.query;
    const [errors, getVentasDto] = GetVentasDto.create(+page, +limit);

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
          {
            usuario: {
              nombre: { contains: String(search), mode: 'insensitive' },
            },
          },
          { metodo_pago: { contains: String(search), mode: 'insensitive' } },
        ];

        // Also check if search is a number to search by id_venta
        if (!isNaN(Number(search))) {
          whereClause.OR.push({ id_venta: Number(search) });
        }
      }

      const [ventas, total] = await Promise.all([
        prisma.venta.findMany({
          where: whereClause,
          skip: (getVentasDto!.page - 1) * getVentasDto!.limit,
          take: getVentasDto!.limit,
          orderBy: { fecha_hora: 'desc' },
          select: {
            id_venta: true,
            id_usuario: true,
            fecha_hora: true,
            total: true,
            metodo_pago: true,
            usuario: {
              select: { id_usuario: true, nombre: true },
            },
            detalles: true,
          },
        }),
        prisma.venta.count({ where: whereClause }),
      ]);

      const hasNext = getVentasDto!.page * getVentasDto!.limit < total;

      const searchParam = search
        ? `&search=${encodeURIComponent(String(search))}`
        : '';

      return res.json({
        status: 'success',
        message: 'Ventas obtenidas correctamente',
        data: ventas,
        pagination: {
          page: getVentasDto!.page,
          limit: getVentasDto!.limit,
          total,
          next: hasNext
            ? `/api/ventas?page=${getVentasDto!.page + 1}&limit=${getVentasDto!.limit}${searchParam}`
            : null,
          prev:
            getVentasDto!.page > 1
              ? `/api/ventas?page=${getVentasDto!.page - 1}&limit=${getVentasDto!.limit}${searchParam}`
              : null,
        },
      });
    } catch (e) {
      return res.status(500).json({
        status: 'error',
        message: 'Error al obtener ventas',
        errors: null,
        e: e,
      });
    }
  };

  public getVentaByID = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const [errors, getVentaByIdDto] = GetVentaByIdDto.create(id);

    if (errors)
      return res.status(400).json({
        status: 'fail',
        message: 'Los datos proporcionados no son válidos.',
        errors,
      });

    try {
      const venta = await prisma.venta.findUnique({
        where: { id_venta: getVentaByIdDto!.id },
        select: {
          id_venta: true,
          id_usuario: true,
          fecha_hora: true,
          total: true,
          metodo_pago: true,
          usuario: {
            select: { id_usuario: true, nombre: true },
          },
          detalles: true,
        },
      });

      if (!venta) {
        return res.status(404).json({
          status: 'fail',
          message: `Venta with ID ${id} not found`,
          errors: null,
        });
      }

      return res.json({
        status: 'success',
        message: 'Venta obtenida correctamente',
        data: venta,
      });
    } catch (e) {
      return res.status(500).json({
        status: 'error',
        message: 'Error al obtener venta',
        errors: null,
      });
    }
  };

  public createVenta = async (req: Request, res: Response) => {
    const [errors, createVentaDto] = CreateVentaDto.create(req.body);

    if (errors)
      return res.status(400).json({
        status: 'fail',
        message: 'Los datos proporcionados no son válidos.',
        errors,
      });

    try {
      const result = await prisma.$transaction(async (tx) => {
        if (createVentaDto?.id_usuario) {
          const usuarioExists = await tx.usuario.findUnique({
            where: {
              id_usuario: createVentaDto.id_usuario,
            },
          });

          if (!usuarioExists) {
            throw new Error(
              'El usuario seleccionado no es válido o no existe.'
            );
          }
        }

        let totalVenta = 0;
        const detallesParaGuardar = [];

        for (const item of createVentaDto!.productos) {
          const productoDB = await tx.producto.findUnique({
            where: { id_producto: item.id_producto },
          });

          if (!productoDB || !productoDB.activo) {
            throw new Error(
              `Producto con ID ${item.id_producto} no encontrado o inactivo.`
            );
          }

          if (productoDB.stock_actual < item.cantidad) {
            throw new Error(
              `Stock insuficiente para el producto: ${productoDB.nombre}. Stock disponible: ${productoDB.stock_actual}`
            );
          }

          const subtotal = Number(productoDB.precio_venta) * item.cantidad;
          totalVenta += subtotal;

          detallesParaGuardar.push({
            id_producto: item.id_producto,
            cantidad: item.cantidad,
            precio_unitario: productoDB.precio_venta,
            subtotal,
          });

          await tx.producto.update({
            where: { id_producto: item.id_producto },
            data: { stock_actual: { decrement: item.cantidad } },
          });
        }

        const venta = await tx.venta.create({
          data: {
            total: totalVenta,
            id_usuario: createVentaDto!.id_usuario,
            metodo_pago: createVentaDto!.metodo_pago,
            detalles: {
              create: detallesParaGuardar,
            },
          },
          select: {
            id_venta: true,
            id_usuario: true,
            fecha_hora: true,
            total: true,
            metodo_pago: true,
            usuario: {
              select: { id_usuario: true, nombre: true },
            },
            detalles: {
              select: {
                id_detalle_venta_producto: true,
                id_producto: true,
                cantidad: true,
                precio_unitario: true,
                subtotal: true,
                producto: {
                  select: { nombre: true },
                },
              },
            },
          },
        });

        return venta;
      });

      return res.status(201).json({
        status: 'success',
        message: 'Venta creada correctamente',
        data: result,
      });
    } catch (e: any) {
      return res.status(400).json({
        status: 'fail',
        message: e.message || 'Error al procesar la venta.',
        errors: null,
      });
    }
  };

  public updateVenta = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const [errors, updateVentaDto] = UpdateVentaDto.create({
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
      const exists = await prisma.venta.findUnique({
        where: { id_venta: id },
      });

      if (!exists)
        return res.status(404).json({
          status: 'fail',
          message: `Venta with ID ${id} not found`,
          errors: null,
        });

      if (updateVentaDto?.id_usuario) {
        const usuarioExists = await prisma.usuario.findUnique({
          where: {
            id_usuario: updateVentaDto.id_usuario,
          },
        });
        if (!usuarioExists) {
          return res.status(400).json({
            status: 'fail',
            message: 'El usuario seleccionado no es válido.',
            errors: null,
          });
        }
      }

      const venta = await prisma.venta.update({
        where: { id_venta: id },
        data: updateVentaDto!.values,
        select: {
          id_venta: true,
          id_usuario: true,
          fecha_hora: true,
          total: true,
          metodo_pago: true,
          usuario: {
            select: { id_usuario: true, nombre: true },
          },
          detalles: true,
        },
      });

      return res.json({
        status: 'success',
        message: 'Venta actualizada correctamente',
        data: venta,
      });
    } catch (e) {
      return res.status(500).json({
        status: 'error',
        message: 'Error al actualizar venta',
        errors: null,
        e: e,
      });
    }
  };
}
