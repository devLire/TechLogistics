import { Request, Response } from 'express';
import { prisma } from '../../data/posgres';
import {
  CreateMovimientoIngresoDto,
  GetMovimientosIngresoDto,
  GetMovimientoIngresoByIdDto,
} from '../../domain/dtos/movimientos_ingresos';

export class MovimientosIngresoController {
  constructor() {}

  public getMovimientosIngreso = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [errors, getMovimientosDto] = GetMovimientosIngresoDto.create(
      +page,
      +limit
    );

    if (errors) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'Datos inválidos.', errors });
    }

    try {
      const [ingresos, total] = await Promise.all([
        prisma.movimiento_Inventario.findMany({
          where: { tipo: 'INGRESO' }, // FILTRO CLAVE: Solo entradas
          skip: (getMovimientosDto!.page - 1) * getMovimientosDto!.limit,
          take: getMovimientosDto!.limit,
          orderBy: { fecha_movimiento: 'desc' },
          include: {
            usuario: { select: { id_usuario: true, nombre: true } },
          },
        }),
        prisma.movimiento_Inventario.count({ where: { tipo: 'INGRESO' } }),
      ]);

      const hasNext =
        getMovimientosDto!.page * getMovimientosDto!.limit < total;

      return res.json({
        status: 'success',
        data: ingresos,
        pagination: {
          page: getMovimientosDto!.page,
          limit: getMovimientosDto!.limit,
          total,
          next: hasNext
            ? `/api/movimientos-ingreso?page=${getMovimientosDto!.page + 1}&limit=${getMovimientosDto!.limit}`
            : null,
          prev:
            getMovimientosDto!.page > 1
              ? `/api/movimientos-ingreso?page=${getMovimientosDto!.page - 1}&limit=${getMovimientosDto!.limit}`
              : null,
        },
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        status: 'error',
        message: 'Error al obtener los ingresos',
        errors: null,
      });
    }
  };

  public getMovimientoIngresoByID = async (req: Request, res: Response) => {
    const [errors, getMovimientoByIdDto] = GetMovimientoIngresoByIdDto.create(
      +req.params.id
    );

    if (errors) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'Datos inválidos.', errors });
    }

    try {
      const ingreso = await prisma.movimiento_Inventario.findUnique({
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

      // Validar que exista y que el tipo sea estrictamente INGRESO
      if (!ingreso || ingreso.tipo !== 'INGRESO') {
        return res.status(404).json({
          status: 'fail',
          message: 'Movimiento de ingreso no encontrado',
        });
      }

      return res.json({ status: 'success', data: ingreso });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 'error',
        message: 'Error al obtener el detalle del ingreso',
        errors: null,
      });
    }
  };

  public createMovimientoIngreso = async (req: Request, res: Response) => {
    const [errors, createDto] = CreateMovimientoIngresoDto.create(req.body);

    if (errors) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'Datos inválidos.', errors });
    }

    try {
      // Transacción para asegurar la inserción atómica
      const result = await prisma.$transaction(async (tx) => {
        // 1. Verificamos que los productos enviados realmente existan en el catálogo
        for (const detalle of createDto!.detalles) {
          const productoDB = await tx.producto.findUnique({
            where: { id_producto: detalle.id_producto },
          });

          if (!productoDB) {
            throw new Error(
              `El producto con ID ${detalle.id_producto} no existe en el catálogo.`
            );
          }
        }

        // 2. Crear la Cabecera
        const nuevoIngreso = await tx.movimiento_Inventario.create({
          data: {
            id_usuario: createDto!.id_usuario,
            tipo: 'INGRESO',
            total: createDto!.total,
          },
        });

        // 3. Crear los Detalles y AUMENTAR el stock
        for (const detalle of createDto!.detalles) {
          await tx.detalle_Movimiento_Producto.create({
            data: {
              id_movimiento_inventario: nuevoIngreso.id_movimiento_inventario,
              id_producto: detalle.id_producto,
              cantidad: detalle.cantidad,
              precio_unitario: detalle.precio_unitario,
              subtotal: detalle.subtotal,
              observaciones: detalle.observaciones,
            },
          });

          // Aumentar stock
          await tx.producto.update({
            where: { id_producto: detalle.id_producto },
            data: {
              stock_actual: {
                increment: detalle.cantidad,
              },
            },
          });
        }

        return nuevoIngreso;
      });

      return res.status(201).json({
        status: 'success',
        message: 'Movimiento de ingreso registrado correctamente.',
        data: result,
      });
    } catch (error: any) {
      console.error(error);
      return res.status(400).json({
        status: 'fail',
        message: error.message || 'Error al procesar el movimiento de ingreso.',
        errors: null,
      });
    }
  };
}
