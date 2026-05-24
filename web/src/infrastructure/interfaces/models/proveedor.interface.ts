import type {ProductoInterface} from "@/infrastructure/interfaces/models/producto.interface.ts";

export interface ProveedorInterface {
  id_proveedor: number,
  nombre_empresa: string
  contacto: string,
  telefono: string,
  activo: boolean

  // Relación
  productos: ProductoInterface[]
}