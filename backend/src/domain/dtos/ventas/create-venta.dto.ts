export class CreateVentaDto {
  private constructor(
    public readonly productos: { id_producto: number; cantidad: number }[],
    public readonly id_usuario?: number,
    public readonly metodo_pago?: string
  ) {}

  static create(
    object: { [key: string]: any } = {}
  ): [{ [key: string]: string }?, CreateVentaDto?] {
    const { productos, id_usuario, metodo_pago } = object;
    const errors: { [key: string]: string } = {};

    const parsedIdUsuario =
      id_usuario !== undefined ? Number(id_usuario) : undefined;
    if (
      id_usuario !== undefined &&
      (isNaN(parsedIdUsuario!) || parsedIdUsuario! <= 0)
    ) {
      errors.id_usuario = 'El campo "id_usuario" debe ser un número válido mayor a 0.';
    }

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      errors.productos = 'Debe incluir un arreglo de "productos" válido con al menos 1 producto.';
    } else {
      for (const p of productos) {
        const id = Number(p.id_producto);
        const cant = Number(p.cantidad);
        if (isNaN(id) || id <= 0 || isNaN(cant) || cant <= 0) {
          errors.productos = 'Cada producto debe tener "id_producto" y "cantidad" como números válidos mayores a 0.';
          break;
        }
      }
    }

    if (Object.keys(errors).length > 0) return [errors, undefined];

    const productosParseados = productos.map((p: any) => ({
      id_producto: Number(p.id_producto),
      cantidad: Number(p.cantidad)
    }));

    return [
      undefined,
      new CreateVentaDto(
        productosParseados,
        parsedIdUsuario,
        metodo_pago?.trim()
      ),
    ];
  }
}
