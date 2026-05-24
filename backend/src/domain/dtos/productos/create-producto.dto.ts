export class CreateProductoDto {
  private constructor(
    public readonly nombre: string,
    public readonly precio_venta: number,
    public readonly id_categoria: number,
    public readonly id_proveedor: number,
    public readonly descripcion: string,
    public readonly stock_actual: number,
    public readonly stock_minimo: number,
    public readonly codigo_barras?: string
  ) {}

  static create(
    object: { [key: string]: any } = {}
  ): [{ [key: string]: string }?, CreateProductoDto?] {
    const {
      nombre,
      precio_venta,
      id_categoria,
      id_proveedor,
      codigo_barras,
      descripcion,
      stock_actual,
      stock_minimo,
    } = object;

    const errors: { [key: string]: string } = {};

    if (!nombre || nombre.trim() === '') {
      errors.nombre = 'El campo "nombre" es obligatorio.';
    }

    const parsedPrecio = Number(precio_venta);
    if (isNaN(parsedPrecio) || parsedPrecio <= 0) {
      errors.precio_venta =
        'El campo "precio_venta" es obligatorio y debe ser un número mayor a 0.';
    }

    const parsedIdCategoria = Number(id_categoria);
    if (isNaN(parsedIdCategoria) || parsedIdCategoria <= 0) {
      errors.id_categoria =
        'El campo "id_categoria" es obligatorio y debe ser un número válido mayor a 0.';
    }

    const parsedIdProveedor = Number(id_proveedor);
    if (isNaN(parsedIdProveedor) || parsedIdProveedor <= 0) {
      errors.id_proveedor =
        'El campo "id_proveedor" es obligatorio y debe ser un número válido mayor a 0.';
    }

    if (
      !descripcion ||
      typeof descripcion !== 'string' ||
      descripcion.trim() === ''
    ) {
      errors.descripcion = 'El campo "descripcion" es obligatorio.';
    }

    const parsedStockActual = Number(stock_actual);
    if (isNaN(parsedStockActual) || parsedStockActual < 0) {
      errors.stock_actual =
        'El campo "stock_actual" es obligatorio y no puede ser negativo.';
    }

    const parsedStockMinimo = Number(stock_minimo);
    if (isNaN(parsedStockMinimo) || parsedStockMinimo < 0) {
      errors.stock_minimo =
        'El campo "stock_minimo" es obligatorio y no puede ser negativo.';
    }

    if (Object.keys(errors).length > 0) return [errors, undefined];

    return [
      undefined,
      new CreateProductoDto(
        nombre.trim(),
        parsedPrecio,
        parsedIdCategoria,
        parsedIdProveedor,
        descripcion.trim(),
        parsedStockActual,
        parsedStockMinimo,
        codigo_barras?.trim()
      ),
    ];
  }
}
