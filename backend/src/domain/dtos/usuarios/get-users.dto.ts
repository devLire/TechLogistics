export class GetUsersDto {
  private constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly estado: 'ACTIVOS' | 'INACTIVOS' | 'TODOS'
  ) {}

  static create(
    page: number = 1,
    limit: number = 10,
    estado: string = 'ACTIVOS'
  ): [{ [key: string]: string }?, GetUsersDto?] {
    if (isNaN(page) || isNaN(limit))
      return [{ pagination: 'Página y límite deben ser números' }];
    if (page <= 0) return [{ pagination: 'La página debe ser mayor a 0' }];
    if (limit <= 0) return [{ pagination: 'El límite debe ser mayor a 0' }];

    const estadoUpper = estado.toUpperCase() as
      | 'ACTIVOS'
      | 'INACTIVOS'
      | 'TODOS';
    if (!['ACTIVOS', 'INACTIVOS', 'TODOS'].includes(estadoUpper)) {
      return [{ estado: 'El estado debe ser ACTIVOS, INACTIVOS o TODOS' }];
    }

    return [undefined, new GetUsersDto(page, limit, estadoUpper)];
  }
}
