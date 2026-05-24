export interface ProductoInterface {
  id_producto: number,
  id_categoria: number,
  id_proveedor: number,
  codigo_barras: string,
  nombre: string,
  descripcion: string,
  precio_venta: number
  stock_actual: number,
  stock_minimo: number,
  activo: boolean
}