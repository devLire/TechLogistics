export class GetProductosDto {
  private constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly estado: 'ACTIVOS' | 'INACTIVOS' | 'TODOS'
  ) {}

  static create(
    page: number = 1,
    limit: number = 10,
    estado: string = 'ACTIVOS'
  ): [{ [key: string]: string }?, GetProductosDto?] {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    if (isNaN(pageNumber) || isNaN(limitNumber))
      return [{ pagination: 'Página y límite deben ser números' }, undefined];
    if (pageNumber <= 0)
      return [{ pagination: 'La página debe ser mayor a 0' }, undefined];
    if (limitNumber <= 0)
      return [{ pagination: 'El límite debe ser mayor a 0' }, undefined];

    const estadoUpper = estado.toUpperCase() as
      | 'ACTIVOS'
      | 'INACTIVOS'
      | 'TODOS';
    if (!['ACTIVOS', 'INACTIVOS', 'TODOS'].includes(estadoUpper)) {
      return [
        { estado: 'El estado debe ser ACTIVOS, INACTIVOS o TODOS' },
        undefined,
      ];
    }

    return [
      undefined,
      new GetProductosDto(pageNumber, limitNumber, estadoUpper),
    ];
  }
}
