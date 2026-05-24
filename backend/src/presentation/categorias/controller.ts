import { Request, Response } from 'express';
import { prisma } from '../../data/posgres';
import {
  GetCategoriasDto,
  GetCategoriaByIdDto,
  CreateCategoriaDto,
  UpdateCategoriaDto,
} from '../../domain/dtos';

export class CategoriasController {
  public getCategorias = async (req: Request, res: Response) => {
    const { page = 1, limit = 10, search = '' } = req.query;
    const [errors, getCategoriasDto] = GetCategoriasDto.create(+page, +limit);

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
          { nombre: { contains: String(search), mode: 'insensitive' } },
        ];
      }

      const [categorias, total] = await Promise.all([
        prisma.categoria.findMany({
          where: whereClause,
          skip: (getCategoriasDto!.page - 1) * getCategoriasDto!.limit,
          take: getCategoriasDto!.limit,
          select: {
            id_categoria: true,
            nombre: true,
            descripcion: true,
          },
        }),
        prisma.categoria.count({ where: whereClause }),
      ]);

      const hasNext = getCategoriasDto!.page * getCategoriasDto!.limit < total;

      const searchParam = search
        ? `&search=${encodeURIComponent(String(search))}`
        : '';

      return res.json({
        status: 'success',
        message: 'Categoras obtenidas correctamente',
        data: categorias,
        pagination: {
          page: getCategoriasDto!.page,
          limit: getCategoriasDto!.limit,
          total,
          next: hasNext
            ? `/api/categorias?page=${getCategoriasDto!.page + 1}&limit=${getCategoriasDto!.limit}${searchParam}`
            : null,
          prev:
            getCategoriasDto!.page > 1
              ? `/api/categorias?page=${getCategoriasDto!.page - 1}&limit=${getCategoriasDto!.limit}${searchParam}`
              : null,
        },
      });
    } catch (e) {
      return res.status(500).json({
        status: 'error',
        message: 'Error al obtener categorías',
        errors: null,
      });
    }
  };

  public getCategoriaByID = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const [errors, getCategoriaByIdDto] = GetCategoriaByIdDto.create(id);

    if (errors)
      return res.status(400).json({
        status: 'fail',
        message: 'Los datos proporcionados no son válidos.',
        errors,
      });

    try {
      const categoria = await prisma.categoria.findUnique({
        where: { id_categoria: getCategoriaByIdDto!.id },
        select: {
          id_categoria: true,
          nombre: true,
          descripcion: true,
        },
      });

      if (!categoria) {
        return res.status(404).json({
          status: 'fail',
          message: `Categoria with ID ${id} not found`,
          errors: null,
        });
      }

      return res.json({
        status: 'success',
        message: 'Categoría obtenida correctamente',
        data: categoria,
      });
    } catch (e) {
      return res.status(500).json({
        status: 'error',
        message: 'Error al obtener categoría',
        errors: null,
      });
    }
  };

  public createCategoria = async (req: Request, res: Response) => {
    const [errors, createCategoriaDto] = CreateCategoriaDto.create(req.body);

    if (errors)
      return res.status(400).json({
        status: 'fail',
        message: 'Los datos proporcionados no son válidos.',
        errors,
      });

    try {
      const existingCategory = await prisma.categoria.findFirst({
        where: {
          nombre: createCategoriaDto!.nombre,
        },
      });

      if (existingCategory)
        return res.status(400).json({
          status: 'fail',
          message: 'El nombre de la categoría ya existe',
          errors: null,
        });

      const categoria = await prisma.categoria.create({
        data: {
          nombre: createCategoriaDto!.nombre,
          descripcion: createCategoriaDto!.descripcion,
          activo: true,
        },
        select: {
          id_categoria: true,
          nombre: true,
          descripcion: true,
        },
      });

      return res.status(201).json({
        status: 'success',
        message: 'Categoría creada correctamente',
        data: categoria,
      });
    } catch (e) {
      return res.status(500).json({
        status: 'error',
        message: 'Error al crear categoría en el servidor',
        errors: null,
      });
    }
  };

  public updateCategoria = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const [errors, updateCategoriaDto] = UpdateCategoriaDto.create({
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
      const exists = await prisma.categoria.findUnique({
        where: { id_categoria: id },
      });

      if (!exists)
        return res.status(404).json({
          status: 'fail',
          message: `Categoria with ID ${id} not found`,
          errors: null,
        });

      if (updateCategoriaDto?.nombre) {
        const existingCategory = await prisma.categoria.findFirst({
          where: {
            nombre: updateCategoriaDto!.nombre,
            NOT: {
              id_categoria: updateCategoriaDto!.id,
            },
          },
        });

        if (existingCategory)
          return res.status(400).json({
            status: 'fail',
            message: 'El nombre de la categoría ya existe',
            errors: null,
          });
      }

      const categoria = await prisma.categoria.update({
        where: { id_categoria: id },
        data: updateCategoriaDto!.values,
        select: {
          id_categoria: true,
          nombre: true,
          descripcion: true,
        },
      });

      return res.json({
        status: 'success',
        message: 'Categoría actualizada correctamente',
        data: categoria,
      });
    } catch (e) {
      return res.status(500).json({
        status: 'error',
        message: 'Error al actualizar categoría',
        errors: null,
      });
    }
  };

  public deleteCategoria = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const [errors, getCategoriaByIdDto] = GetCategoriaByIdDto.create(id);
    if (errors)
      return res.status(400).json({
        status: 'fail',
        message: 'Los datos proporcionados no son válidos.',
        errors,
      });
    try {
      const exists = await prisma.categoria.findUnique({
        where: { id_categoria: getCategoriaByIdDto!.id },
      });

      if (!exists)
        return res.status(404).json({
          status: 'fail',
          message: `Categoria with ID ${getCategoriaByIdDto!.id} not found`,
          errors: null,
        });

      const categoria = await prisma.categoria.update({
        where: { id_categoria: getCategoriaByIdDto!.id },
        data: { activo: false },
        select: {
          id_categoria: true,
          nombre: true,
          descripcion: true,
        },
      });

      return res.json({
        status: 'success',
        message: 'Categoría eliminada correctamente',
        data: categoria,
      });
    } catch (e) {
      return res.status(500).json({
        status: 'error',
        message: 'Error al eliminar categoría',
        errors: null,
      });
    }
  };
}
