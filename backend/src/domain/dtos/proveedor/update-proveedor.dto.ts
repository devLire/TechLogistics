export class UpdateProveedorDto {
  private constructor(
    public readonly id: number,
    public readonly nombre_empresa?: string,
    public readonly contacto?: string,
    public readonly telefono?: string,
    public readonly activo?: boolean
  ) {}

  get values() {
    const returnObj: { [key: string]: any } = {};

    if (this.nombre_empresa !== undefined) returnObj.nombre_empresa = this.nombre_empresa;
    if (this.contacto !== undefined) returnObj.contacto = this.contacto;
    if (this.telefono !== undefined) returnObj.telefono = this.telefono;
    if (this.activo !== undefined) returnObj.activo = this.activo;

    return returnObj;
  }

  static create(object: {
    [key: string]: any;
  }): [{ [key: string]: string }?, UpdateProveedorDto?] {
    const { id, nombre_empresa, contacto, telefono, activo } = object;
    const normalizedTelefono = telefono?.toString();

    const numericId = Number(id);

    if (isNaN(numericId) || numericId <= 0) {
      return [{ id: 'El ID debe ser un número válido' }, undefined];
    }

    if (
      !nombre_empresa &&
      contacto === undefined &&
      normalizedTelefono === undefined &&
      activo === undefined
    ) {
      return [{ data: 'No hay datos para actualizar' }, undefined];
    }

    return [
      undefined,
      new UpdateProveedorDto(
        numericId,
        nombre_empresa?.trim(),
        contacto?.trim(),
        normalizedTelefono?.trim(),
        activo !== undefined ? Boolean(activo) : undefined
      ),
    ];
  }
}
