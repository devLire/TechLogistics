export class GetCategoriaByIdDto {
  private constructor(
    public readonly id: number
  ) {}

  static create(id: number): [
    { [key: string]: string }?,
    GetCategoriaByIdDto?,
  ] {
    const numericId = Number(id);
    if (isNaN(numericId))
      return [{ id: 'El ID debe ser un número válido' }, undefined];
    if (numericId <= 0) return [{ id: 'El ID debe ser mayor a 0' }, undefined];

    return [undefined, new GetCategoriaByIdDto(numericId)];
  }
}