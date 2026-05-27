export interface VentaInterface {
  id_venta: number
  id_usuario: number
  fecha_hora: Date
  total: number
  metodo_pago: string
}