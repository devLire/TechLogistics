export class GetVentaByIdDto {
  private constructor(public readonly id: number) {}

  static create(id: number): [{ [key: string]: string }?, GetVentaByIdDto?] {
    if (isNaN(id)) return [{ id: 'El ID debe ser un número válido' }];
    if (id <= 0) return [{ id: 'El ID debe ser un número mayor a 0' }];
    return [undefined, new GetVentaByIdDto(id)];
  }
}

