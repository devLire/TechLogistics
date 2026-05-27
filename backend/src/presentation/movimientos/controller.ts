import { Request, Response } from 'express';
import { prisma } from '../../data/posgres';
import {
  CreateMovimientoDto,
  GetMovimientosDto,
  GetMovimientoByIdDto,
} from '../../domain/dtos/movimientos';
import { formatErrors } from '../utils/formatErrors';

export class MovimientosController {
  constructor() {}

  public getMovimientos = async (req: Request, res: Response) => {
    const { page = 1, limit = 10, tipo, search = '' } = req.query;
    const [errors, getMovimientosDto] = GetMovimientosDto.create(
      +page,
      +limit,
      tipo as string
    );

    if (errors) {
      return res.status(400).json({
        status: 'fail',
        message: 'Datos inválidos.',
        errors: formatErrors(errors),
      });
    }

    try {
      const baseWhere: any = {};

      if (search) {
        baseWhere.OR = [
          {
            usuario: {
              nombre: { contains: String(search), mode: 'insensitive' },
            },
          },
          {
            detalles: {
              some: {
                observaciones: {
                  contains: String(search),
                  mode: 'insensitive',
                },
              },
            },
          },
        ];
      }

      const whereClause = getMovimientosDto!.tipo
        ? { ...baseWhere, tipo: getMovimientosDto!.tipo }
        : baseWhere;

      const acumuladoWhere = getMovimientosDto!.tipo
        ? { tipo: getMovimientosDto!.tipo }
        : {};

      const [
        movimientos,
        total,
        agregacionAcumulado,
        countIngreso,
        countSalida,
      ] = await Promise.all([
        prisma.movimiento_Inventario.findMany({
          where: whereClause,
          skip: (getMovimientosDto!.page - 1) * getMovimientosDto!.limit,
          take: getMovimientosDto!.limit,
          orderBy: { id_movimiento_inventario: 'desc' },
          include: {
            usuario: { select: { id_usuario: true, nombre: true } },
          },
        }),
        prisma.movimiento_Inventario.count({ where: whereClause }),
        prisma.movimiento_Inventario.aggregate({
          where: acumuladoWhere,
          _sum: {
            total: true,
          },
        }),
        prisma.movimiento_Inventario.count({
          where: { ...baseWhere, tipo: 'INGRESO' },
        }),
        prisma.movimiento_Inventario.count({
          where: { ...baseWhere, tipo: 'SALIDA' },
        }),
      ]);

      const total_acumulado = agregacionAcumulado._sum.total || 0;

      const hasNext =
        getMovimientosDto!.page * getMovimientosDto!.limit < total;

      const tipoParam = getMovimientosDto!.tipo
        ? `&tipo=${getMovimientosDto!.tipo}`
        : '';
      const searchParam = search
        ? `&search=${encodeURIComponent(String(search))}`
        : '';
      const extraParams = `${tipoParam}${searchParam}`;

      let total_movimientos: number;
      if (!getMovimientosDto!.tipo) {
        total_movimientos = Number(countIngreso) + Number(countSalida);
      } else if (String(getMovimientosDto!.tipo).toUpperCase() === 'INGRESO') {
        total_movimientos = Number(countIngreso);
      } else if (String(getMovimientosDto!.tipo).toUpperCase() === 'SALIDA') {
        total_movimientos = Number(countSalida);
      } else {
        total_movimientos = Number(total);
      }

      return res.json({
        status: 'success',
        message: 'Movimientos obtenidos satisfactoriamente',
        total_acumulado,
        total_movimientos,
        data: movimientos,
        errors: formatErrors(null),
        pagination: {
          page: getMovimientosDto!.page,
          limit: getMovimientosDto!.limit,
          total,
          next: hasNext
            ? `/api/movimientos?page=${getMovimientosDto!.page + 1}&limit=${getMovimientosDto!.limit}${extraParams}`
            : null,
          prev:
            getMovimientosDto!.page > 1
              ? `/api/movimientos?page=${getMovimientosDto!.page - 1}&limit=${getMovimientosDto!.limit}${extraParams}`
              : null,
        },
      });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Error al obtener los movimientos',
        errors: formatErrors(error),
      });
    }
  };

  public getMovimientoByID = async (req: Request, res: Response) => {
    const [errors, getMovimientoByIdDto] = GetMovimientoByIdDto.create(
      +req.params.id
    );

    if (errors) {
      return res.status(400).json({
        status: 'fail',
        message: 'Datos inválidos.',
        errors: formatErrors(errors),
      });
    }

    try {
      const movimiento = await prisma.movimiento_Inventario.findUnique({
        where: { id_movimiento_inventario: getMovimientoByIdDto!.id },
        include: {
          usuario: {
            select: {
              nombre: true,
              email: true,
            },
          },
          detalles: {
            include: {
              producto: {
                select: {
                  nombre: true,
                  codigo_barras: true,
                },
              },
            },
          },
        },
      });

      if (!movimiento) {
        return res.status(404).json({
          status: 'fail',
          message: 'Movimiento no encontrado',
          errors: formatErrors(null),
        });
      }

      return res.json({
        status: 'success',
        message: 'Movimiento obtenido satisfactoriamente',
        data: movimiento,
        errors: formatErrors(null),
      });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Error al obtener el detalle del movimiento',
        errors: formatErrors(error),
      });
    }
  };

  public createMovimiento = async (req: Request, res: Response) => {
    const [errors, createDto] = CreateMovimientoDto.create(req.body);

    if (errors) {
      return res.status(400).json({
        status: 'fail',
        message: 'Datos inválidos.',
        errors: formatErrors(errors),
      });
    }

    try {
      const result = await prisma.$transaction(async (tx) => {
        for (const detalle of createDto!.detalles) {
          const productoDB = await tx.producto.findUnique({
            where: { id_producto: detalle.id_producto },
          });

          if (!productoDB) {
            throw new Error(
              `El producto con ID ${detalle.id_producto} no existe.`
            );
          }

          if (
            createDto!.tipo === 'SALIDA' &&
            productoDB.stock_actual < detalle.cantidad
          ) {
            throw new Error(
              `Stock insuficiente para el producto '${productoDB.nombre}'. Disponible: ${productoDB.stock_actual}, Solicitado: ${detalle.cantidad}.`
            );
          }
        }

        const nuevoMovimiento = await tx.movimiento_Inventario.create({
          data: {
            id_usuario: createDto!.id_usuario,
            tipo: createDto!.tipo,
            total: createDto!.total,
          },
        });

        for (const detalle of createDto!.detalles) {
          await tx.detalle_Movimiento_Producto.create({
            data: {
              id_movimiento_inventario:
                nuevoMovimiento.id_movimiento_inventario,
              id_producto: detalle.id_producto,
              cantidad: detalle.cantidad,
              precio_unitario: detalle.precio_unitario,
              subtotal: detalle.subtotal,
              observaciones: detalle.observaciones,
            },
          });

          await tx.producto.update({
            where: { id_producto: detalle.id_producto },
            data: {
              stock_actual:
                createDto!.tipo === 'INGRESO'
                  ? { increment: detalle.cantidad }
                  : { decrement: detalle.cantidad },
            },
          });
        }

        return nuevoMovimiento;
      });

      return res.status(201).json({
        status: 'success',
        message: `Movimiento de ${createDto!.tipo.toLowerCase()} registrado correctamente.`,
        data: result,
        errors: formatErrors(null),
      });
    } catch (error: any) {
      console.error(error);
      return res.status(400).json({
        status: 'fail',
        message: error.message || 'Error al procesar el movimiento.',
        errors: formatErrors(error),
      });
    }
  };
}
