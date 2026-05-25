export class GetMovimientosDto {
  private constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly tipo?: 'INGRESO' | 'SALIDA'
  ) {}

  static create(
    page: number = 1,
    limit: number = 10,
    tipo?: string
  ): [{ [key: string]: string }?, GetMovimientosDto?] {
    const errors: { [key: string]: string } = {};

    if (isNaN(page) || page <= 0) errors.page = 'La página debe ser mayor a 0';
    if (isNaN(limit) || limit <= 0)
      errors.limit = 'El límite debe ser mayor a 0';

    let validTipo: 'INGRESO' | 'SALIDA' | undefined = undefined;
    if (tipo) {
      if (tipo.toUpperCase() === 'INGRESO' || tipo.toUpperCase() === 'SALIDA') {
        validTipo = tipo.toUpperCase() as 'INGRESO' | 'SALIDA';
      } else {
        errors.tipo = 'El tipo debe ser INGRESO o SALIDA';
      }
    }

    if (Object.keys(errors).length > 0) return [errors, undefined];

    return [undefined, new GetMovimientosDto(page, limit, validTipo)];
  }
}
