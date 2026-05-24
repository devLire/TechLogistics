export class GetIngresosDto {
  private constructor(public readonly page: number, public readonly limit: number) {}

  static create(page: number = 1, limit: number = 10): [{ [key: string]: string }?, GetIngresosDto?] {
    const errors: { [key: string]: string } = {};

    if (isNaN(page) || page <= 0) {
      errors.page = 'La página debe ser un número mayor a 0';
    }

    if (isNaN(limit) || limit <= 0) {
      errors.limit = 'El límite debe ser un número mayor a 0';
    }

    if (Object.keys(errors).length > 0) return [errors, undefined];

    return [undefined, new GetIngresosDto(page, limit)];
  }
}

