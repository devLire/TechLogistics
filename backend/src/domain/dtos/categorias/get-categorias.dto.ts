export class GetCategoriasDto {
  private constructor(
    public readonly page: number,
    public readonly limit: number
  ) {}

  static create(
    page: number = 1,
    limit: number = 10
  ): [{ [key: string]: string }?, GetCategoriasDto?] {
    if (isNaN(page) || isNaN(limit))
      return [{ pagination: 'Página y límite deben ser números' }, undefined];
    if (page <= 0) return [{ pagination: 'La página debe ser mayor a 0' }, undefined];
    if (limit <= 0) return [{ pagination: 'El límite debe ser mayor a 0' }, undefined];

    return [undefined, new GetCategoriasDto(page, limit)];
  }
}