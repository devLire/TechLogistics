export class GetUserByIdDto {
  private constructor(public readonly id: number) {}

  static create(id: number): [{ [key: string]: string }?, GetUserByIdDto?] {
    const numericId = Number(id);
    if (isNaN(numericId))
      return [{ id: 'El ID debe ser un número válido' }, undefined];
    if (numericId <= 0) return [{ id: 'El ID debe ser mayor a 0' }, undefined];
    return [undefined, new GetUserByIdDto(id)];
  }
}
