export class GetDispositivosDto {
  private constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly estado: 'ACTIVOS' | 'INACTIVOS' | 'TODOS'
  ) {}

  static create(
    page: number = 1,
    limit: number = 10,
    estado: string = 'ACTIVOS'
  ): [{ [key: string]: string }?, GetDispositivosDto?] {
    const errors: { [key: string]: string } = {};

    if (isNaN(page) || page <= 0) {
      errors.page = 'La página debe ser un número mayor a 0';
    }

    if (isNaN(limit) || limit <= 0) {
      errors.limit = 'El límite debe ser un número mayor a 0';
    }

    const estadoUpper = estado.toUpperCase() as
      | 'ACTIVOS'
      | 'INACTIVOS'
      | 'TODOS';
    if (!['ACTIVOS', 'INACTIVOS', 'TODOS'].includes(estadoUpper)) {
      errors.estado = 'El estado debe ser ACTIVOS, INACTIVOS o TODOS';
    }

    if (Object.keys(errors).length > 0) return [errors, undefined];

    return [undefined, new GetDispositivosDto(page, limit, estadoUpper)];
  }
}
