interface DetalleSalidaItem {
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  observaciones?: string;
}

export class CreateMovimientoSalidaDto {
  private constructor(
    public readonly id_usuario: number,
    public readonly total: number,
    public readonly detalles: DetalleSalidaItem[]
  ) {}

  static create(object: {
    [key: string]: any;
  }): [{ [key: string]: string }?, CreateMovimientoSalidaDto?] {
    if (!object) return [{ data: 'No se han proporcionado datos' }, undefined];

    const { id_usuario, total, detalles } = object;
    const errors: { [key: string]: string } = {};

    const numericUsuario = Number(id_usuario);
    if (isNaN(numericUsuario) || numericUsuario <= 0) {
      errors.id_usuario = 'El id_usuario debe ser un número válido';
    }

    const numericTotal = Number(total);
    if (isNaN(numericTotal) || numericTotal < 0) {
      errors.total = 'El total debe ser un número válido';
    }

    if (!Array.isArray(detalles) || detalles.length === 0) {
      errors.detalles =
        'Debe proporcionar al menos un detalle de salida (producto)';
    } else {
      detalles.forEach((item, index) => {
        if (!item.id_producto || isNaN(Number(item.id_producto))) {
          errors[`detalles[${index}].id_producto`] = 'ID de producto inválido';
        }
        if (
          !item.cantidad ||
          isNaN(Number(item.cantidad)) ||
          Number(item.cantidad) <= 0
        ) {
          errors[`detalles[${index}].cantidad`] = 'Cantidad inválida';
        }
      });
    }

    if (Object.keys(errors).length > 0) return [errors, undefined];

    return [
      undefined,
      new CreateMovimientoSalidaDto(numericUsuario, numericTotal, detalles),
    ];
  }
}
