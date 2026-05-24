export class RegisterDispositivoDto {
  private constructor(
    public readonly id_usuario: number,
    public readonly dispositivo_id: string,
    public readonly nombre_dispositivo: string
  ) {}

  static create(
    props: {
      [key: string]: any;
    } = {}
  ): [{ [key: string]: string }?, RegisterDispositivoDto?] {
    const { id_usuario, dispositivo_id, nombre_dispositivo } = props;
    const errors: { [key: string]: string } = {};

    const numericId_usuario = Number(id_usuario);
    if (isNaN(numericId_usuario) || numericId_usuario <= 0) {
      errors.id_usuario = 'El id_usuario debe ser un número válido';
    }

    const strDispositivoId =
      dispositivo_id !== undefined && dispositivo_id !== null
        ? String(dispositivo_id)
        : '';

    if (strDispositivoId.trim().length === 0) {
      errors.dispositivo_id = 'El campo "dispositivo_id" es obligatorio.';
    }

    if (!nombre_dispositivo || nombre_dispositivo.trim().length === 0) {
      errors.nombre_dispositivo =
        'El campo "nombre_dispositivo" es obligatorio.';
    }

    if (Object.keys(errors).length > 0) return [errors, undefined];

    return [
      undefined,
      new RegisterDispositivoDto(
        numericId_usuario,
        strDispositivoId,
        nombre_dispositivo
      ),
    ];
  }
}
