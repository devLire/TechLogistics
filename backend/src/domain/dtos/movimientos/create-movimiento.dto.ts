interface DetalleMovimientoItem {
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  observaciones?: string;
}

export class CreateMovimientoDto {
  private constructor(
    public readonly id_usuario: number,
    public readonly total: number,
    public readonly tipo: 'INGRESO' | 'SALIDA',
    public readonly detalles: DetalleMovimientoItem[]
  ) {}

  static create(object: {
    [key: string]: any;
  }): [{ [key: string]: string }?, CreateMovimientoDto?] {
    if (!object) return [{ data: 'No se han proporcionado datos' }, undefined];

    const { id_usuario, total, tipo, detalles } = object;
    const errors: { [key: string]: string } = {};

    const numericUsuario = Number(id_usuario);
    if (isNaN(numericUsuario) || numericUsuario <= 0)
      errors.id_usuario = 'ID de usuario inválido';

    const numericTotal = Number(total);
    if (isNaN(numericTotal) || numericTotal < 0)
      errors.total = 'Total inválido';

    if (tipo !== 'INGRESO' && tipo !== 'SALIDA') {
      errors.tipo =
        'El tipo de movimiento es obligatorio y debe ser INGRESO o SALIDA';
    }

    if (!Array.isArray(detalles) || detalles.length === 0) {
      errors.detalles = 'Debe proporcionar al menos un detalle de producto';
    } else {
      detalles.forEach((item, index) => {
        if (!item.id_producto || isNaN(Number(item.id_producto)))
          errors[`detalles[${index}].id_producto`] = 'ID inválido';
        if (
          !item.cantidad ||
          isNaN(Number(item.cantidad)) ||
          Number(item.cantidad) <= 0
        )
          errors[`detalles[${index}].cantidad`] = 'Cantidad inválida';
      });
    }

    if (Object.keys(errors).length > 0) return [errors, undefined];

    return [
      undefined,
      new CreateMovimientoDto(numericUsuario, numericTotal, tipo, detalles),
    ];
  }
}
