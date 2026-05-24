export class CreateProveedorDto {
  private constructor(
    public readonly nombre_empresa: string,
    public readonly contacto?: string,
    public readonly telefono?: string
  ) {}

  static create(object: {
    [key: string]: any;
  }): [{ [key: string]: string }?, CreateProveedorDto?] {
    const { nombre_empresa, contacto, telefono } = object;
    const normalizedTelefono = telefono.toString();

    const errors: { [key: string]: string } = {};

    if (!nombre_empresa || nombre_empresa.trim() === '') {
      errors.nombre_empresa = 'El nombre de la empresa es obligatorio';
    }

    if (!contacto || contacto.trim() === '') {
      errors.contacto = 'El contacto de la empresa es obligatorio';
    }

    if (!normalizedTelefono || normalizedTelefono.trim() === '') {
      errors.telefono = 'El teléfono de la empresa es obligatorio';
    }

    if (Object.keys(errors).length > 0) return [errors, undefined];

    return [
      undefined,
      new CreateProveedorDto(
        nombre_empresa.trim(),
        contacto?.trim(),
        normalizedTelefono?.trim()
      ),
    ];
  }
}
