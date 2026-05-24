export class UpdateDispositivoDto {
  private constructor(
    public readonly id: number,
    public readonly id_usuario?: number,
    public readonly dispositivo_id?: string,
    public readonly nombre_dispositivo?: string,
    public readonly activo?: boolean
  ) {}

  get values() {
    const returnObj: { [key: string]: any } = {};

    if (this.id_usuario) returnObj.id_usuario = this.id_usuario;
    if (this.dispositivo_id !== undefined)
      returnObj.dispositivo_id = this.dispositivo_id;
    if (this.nombre_dispositivo !== undefined)
      returnObj.nombre_dispositivo = this.nombre_dispositivo;
    if (this.activo !== undefined) returnObj.activo = this.activo;

    return returnObj;
  }

  static create(object: {
    [key: string]: any;
  }): [{ [key: string]: string }?, UpdateDispositivoDto?] {
    const { id, id_usuario, dispositivo_id, nombre_dispositivo, activo } =
      object;
    const errors: { [key: string]: string } = {};
    const numericId = Number(id);

    if (isNaN(numericId) || numericId <= 0) {
      return [{ id: 'El ID debe ser un número válido' }, undefined];
    }

    const numericId_usuario =
      id_usuario !== undefined ? Number(id_usuario) : undefined;
    if (
      id_usuario !== undefined &&
      (isNaN(numericId_usuario!) || numericId_usuario! <= 0)
    ) {
      errors.id_usuario = 'El id_usuario debe ser un número válido';
    }

    const strDispositivoId =
      dispositivo_id !== undefined && dispositivo_id !== null
        ? String(dispositivo_id)
        : '';

    const strNombreDispositivo =
      nombre_dispositivo !== undefined && nombre_dispositivo !== null
        ? String(nombre_dispositivo)
        : '';

    if (
      !id_usuario &&
      dispositivo_id === undefined &&
      nombre_dispositivo === undefined &&
      activo === undefined
    ) {
      return [{ data: 'No hay datos para actualizar' }, undefined];
    }

    if (Object.keys(errors).length > 0) return [errors, undefined];

    return [
      undefined,
      new UpdateDispositivoDto(
        numericId,
        numericId_usuario,
        strDispositivoId?.trim(),
        strNombreDispositivo?.trim(),
        activo !== undefined ? Boolean(activo) : undefined
      ),
    ];
  }
}
