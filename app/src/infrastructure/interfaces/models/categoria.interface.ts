import type {ProductoInterface} from "@/infrastructure/interfaces/models/producto.interface.ts";

export interface CategoriaInterface {
  id_categoria: number,
  nombre: string,
  descripcion: string,
  activo: boolean

  // Relación
  productos: ProductoInterface[]
}