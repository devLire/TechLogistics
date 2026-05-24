export class GetDispositivosByUserIdDto {
  private constructor(public readonly id_usuario: number) {}

  static create(
    id_usuario: number
  ): [{ [key: string]: string }?, GetDispositivosByUserIdDto?] {
    const numericId = Number(id_usuario);
    if (isNaN(numericId))
      return [{ id_usuario: 'El ID debe ser un número válido' }, undefined];
    if (numericId <= 0)
      return [{ id_usuario: 'El ID debe ser mayor a 0' }, undefined];
    return [undefined, new GetDispositivosByUserIdDto(id_usuario)];
  }
}
