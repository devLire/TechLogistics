export class GetProductosDto {
  private constructor(
    public readonly page: number,
    public readonly limit: number
  ) {}

  static create(
    page: number = 1,
    limit: number = 10
  ): [{ [key: string]: string }?, GetProductosDto?] {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    if (isNaN(pageNumber) || isNaN(limitNumber))
      return [{ pagination: 'Página y límite deben ser números' }, undefined];
    if (pageNumber <= 0) return [{ pagination: 'La página debe ser mayor a 0' }, undefined];
    if (limitNumber <= 0) return [{ pagination: 'El límite debe ser mayor a 0' }, undefined];

    return [undefined, new GetProductosDto(pageNumber, limitNumber)];
  }
}

