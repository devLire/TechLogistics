export class CreateIngresoDto {
  private constructor(
    public readonly id_producto: number,
    public readonly id_usuario: number,
    public readonly cantidad_ingresada: number
  ) {}

  static create(object: { [key: string]: any }): [{ [key: string]: string }?, CreateIngresoDto?] {
    if (!object) return [{ data: 'No se han proporcionado datos' }, undefined];

    const { id_producto, id_usuario, cantidad_ingresada } = object;
    const errors: { [key: string]: string } = {};

    const numericProducto = Number(id_producto);
    if (isNaN(numericProducto) || numericProducto <= 0) {
      errors.id_producto = 'El id_producto debe ser un número válido';
    }

    const numericUsuario = Number(id_usuario);
    if (isNaN(numericUsuario) || numericUsuario <= 0) {
      errors.id_usuario = 'El id_usuario debe ser un número válido';
    }

    const numericCantidad = Number(cantidad_ingresada);
    if (isNaN(numericCantidad) || numericCantidad <= 0) {
      errors.cantidad_ingresada = 'La cantidad_ingresada debe ser un número válido mayor a 0';
    }

    if (Object.keys(errors).length > 0) return [errors, undefined];

    return [undefined, new CreateIngresoDto(numericProducto, numericUsuario, numericCantidad)];
  }
}

