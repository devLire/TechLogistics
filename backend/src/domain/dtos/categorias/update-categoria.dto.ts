export class UpdateCategoriaDto {
  private constructor(
    public readonly id: number,
    public readonly nombre?: string,
    public readonly descripcion?: string,
    public readonly activo?: boolean
  ) {}

  get values() {
    const returnObj: { [key: string]: any } = {};

    if (this.nombre !== undefined) returnObj.nombre = this.nombre;
    if (this.descripcion !== undefined)
      returnObj.descripcion = this.descripcion;
    if (this.activo !== undefined) returnObj.activo = this.activo;

    return returnObj;
  }

  static create(object: {
    [key: string]: any;
  }): [{ [key: string]: string }?, UpdateCategoriaDto?] {
    const { id, nombre, descripcion, activo } = object;
    const numericId = Number(id);

    if (isNaN(numericId) || numericId <= 0) {
      return [{ id: 'El ID debe ser un número válido' }, undefined];
    }

    if (!nombre && descripcion === undefined && activo === undefined) {
      return [{ data: 'No hay datos para actualizar' }, undefined];
    }

    return [
      undefined,
      new UpdateCategoriaDto(numericId, nombre?.trim(), descripcion?.trim(), activo !== undefined ? Boolean(activo) : undefined),
    ];
  }
}
