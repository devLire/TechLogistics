export class CreateCategoriaDto {
  private constructor(
    public readonly nombre: string,
    public readonly descripcion?: string
  ) {}

  static create(object: {
    [key: string]: any;
  }): [{ [key: string]: string }?, CreateCategoriaDto?] {
    const { nombre, descripcion } = object;

    const errors: { [key: string]: string } = {};

    if (!nombre || nombre.trim() === '') {
      errors.nombre = 'El campo "nombre" es obligatorio.';
    }

    if (Object.keys(errors).length > 0) return [errors, undefined];

    return [
      undefined,
      new CreateCategoriaDto(nombre.trim(), descripcion?.trim()),
    ];
  }
}
