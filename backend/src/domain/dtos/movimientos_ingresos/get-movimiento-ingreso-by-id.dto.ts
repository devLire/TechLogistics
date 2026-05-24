export class GetMovimientoIngresoByIdDto {
  private constructor(public readonly id: number) {}

  static create(
    id: number
  ): [{ [key: string]: string }?, GetMovimientoIngresoByIdDto?] {
    const numericId = Number(id);

    if (isNaN(numericId) || numericId <= 0) {
      return [{ id: 'El ID debe ser un número válido' }, undefined];
    }

    return [undefined, new GetMovimientoIngresoByIdDto(numericId)];
  }
}
