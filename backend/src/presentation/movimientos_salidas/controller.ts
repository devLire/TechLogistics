import { Request, Response } from 'express';
import { prisma } from '../../data/posgres';
import {
  CreateMovimientoSalidaDto,
  GetMovimientoSalidaByIdDto,
  GetMovimientosSalidaDto,
} from '../../domain/dtos/movimientos_salidas';
import { formatErrors } from '../utils/formatErrors';

export class MovimientosSalidaController {
  constructor() {}

  public getMovimientosSalida = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [errors, getMovimientosDto] = GetMovimientosSalidaDto.create(
      +page,
      +limit
    );

    if (errors) {
      return res
        .status(400)
        .json({
          status: 'fail',
          message: 'Datos inválidos.',
          errors: formatErrors(errors),
        });
    }

    try {
      const [salidas, total] = await Promise.all([
        prisma.movimiento_Inventario.findMany({
          where: { tipo: 'SALIDA' },
          skip: (getMovimientosDto!.page - 1) * getMovimientosDto!.limit,
          take: getMovimientosDto!.limit,
          orderBy: { fecha_movimiento: 'desc' },
          include: {
            usuario: { select: { id_usuario: true, nombre: true } },
          },
        }),
        prisma.movimiento_Inventario.count({ where: { tipo: 'SALIDA' } }),
      ]);

      const hasNext =
        getMovimientosDto!.page * getMovimientosDto!.limit < total;

      return res.json({
        status: 'success',
        message: 'Movimientos de salidas obtenidos satisfactoriamente',
        data: salidas,
        pagination: {
          page: getMovimientosDto!.page,
          limit: getMovimientosDto!.limit,
          total,
          next: hasNext
            ? `/api/movimientos-salida?page=${getMovimientosDto!.page + 1}&limit=${getMovimientosDto!.limit}`
            : null,
          prev:
            getMovimientosDto!.page > 1
              ? `/api/movimientos-salida?page=${getMovimientosDto!.page - 1}&limit=${getMovimientosDto!.limit}`
              : null,
        },
      });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Error al obtener las salidas',
        errors: formatErrors(error),
      });
    }
  };

  public getMovimientoSalidaByID = async (req: Request, res: Response) => {
    const [errors, getMovimientoByIdDto] = GetMovimientoSalidaByIdDto.create(
      +req.params.id
    );

    if (errors) {
      return res
        .status(400)
        .json({
          status: 'fail',
          message: 'Datos inválidos.',
          errors: formatErrors(errors),
        });
    }

    try {
      const salida = await prisma.movimiento_Inventario.findUnique({
        where: { id_movimiento_inventario: getMovimientoByIdDto!.id },
        include: {
          usuario: { select: { nombre: true, email: true } },
          detalles: {
            include: {
              producto: { select: { nombre: true, codigo_barras: true } },
            },
          },
        },
      });

      if (!salida || salida.tipo !== 'SALIDA') {
        return res.status(404).json({
          status: 'fail',
          message: 'Movimiento de salida no encontrado',
          errors: formatErrors(null),
        });
      }

      return res.json({
        status: 'success',
        message: 'Movimiento de salida obtenido satisfactoriamente',
        data: salida,
      });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Error al obtener el detalle de la salida',
        errors: formatErrors(error),
      });
    }
  };

  public createMovimientoSalida = async (req: Request, res: Response) => {
    const [errors, createDto] = CreateMovimientoSalidaDto.create(req.body);

    if (errors) {
      return res
        .status(400)
        .json({
          status: 'fail',
          message: 'Datos inválidos.',
          errors: formatErrors(errors),
        });
    }

    try {
      const result = await prisma.$transaction(async (tx) => {
        // 1. Verificamos que haya stock suficiente para todos los productos ANTES de crear nada
        for (const detalle of createDto!.detalles) {
          const productoDB = await tx.producto.findUnique({
            where: { id_producto: detalle.id_producto },
          });

          if (!productoDB) {
            throw new Error(
              `El producto con ID ${detalle.id_producto} no existe.`
            );
          }

          if (productoDB.stock_actual < detalle.cantidad) {
            throw new Error(
              `Stock insuficiente para el producto '${productoDB.nombre}'. Disponible: ${productoDB.stock_actual}, Solicitado: ${detalle.cantidad}.`
            );
          }
        }

        // 2. Crear la Cabecera (Movimiento_Inventario)
        const nuevaSalida = await tx.movimiento_Inventario.create({
          data: {
            id_usuario: createDto!.id_usuario,
            tipo: 'SALIDA',
            total: createDto!.total,
          },
        });

        // 3. Crear los Detalles y actualizar el stock
        for (const detalle of createDto!.detalles) {
          // Crear detalle
          await tx.detalle_Movimiento_Producto.create({
            data: {
              id_movimiento_inventario: nuevaSalida.id_movimiento_inventario,
              id_producto: detalle.id_producto,
              cantidad: detalle.cantidad,
              precio_unitario: detalle.precio_unitario,
              subtotal: detalle.subtotal,
              observaciones: detalle.observaciones,
            },
          });

          // Descontar stock
          await tx.producto.update({
            where: { id_producto: detalle.id_producto },
            data: {
              stock_actual: {
                decrement: detalle.cantidad,
              },
            },
          });
        }

        return nuevaSalida;
      });

      return res.status(201).json({
        status: 'success',
        message: 'Movimiento de salida registrado correctamente.',
        data: result,
      });
    } catch (error: any) {
      console.error(error);
      return res.status(400).json({
        status: 'fail',
        message: error.message || 'Error al procesar el movimiento de salida.',
        errors: formatErrors(error),
      });
    }
  };
}
