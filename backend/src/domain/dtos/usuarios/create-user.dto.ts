import { regularExps } from '../../../config/regular-exp';

export class CreateUserDto {
  private constructor(
    public readonly nombre: string,
    public readonly email: string,
    public readonly rol: string,
    public readonly password: string
  ) {}

  static create(props: { [key: string]: any }): [
    {
      [key: string]: string;
    }?,
    CreateUserDto?,
  ] {
    const { nombre, email, rol, password } = props;
    const errors: { [key: string]: string } = {};

    if (!nombre || nombre.trim().length === 0) {
      errors.nombre = 'El campo "nombre" es obligatorio.';
    }

    if (!email) {
      errors.email = 'El campo "email" es obligatorio.';
    } else {
      if (!regularExps.email.test(email))
        errors.email = 'El email no es válido.';
    }

    const allowedRoles = ['ADMINISTRADOR', 'CAJERO', 'INVENTARIO'];
    if (!rol) {
      errors.rol = 'El campo "rol" es obligatorio.';
    } else if (!allowedRoles.includes(rol.toUpperCase().trim())) {
      errors.rol = `Roles permitidos: ${allowedRoles.join(', ')}.`;
    }

    if (!password) {
      errors.password = 'El campo "password" es obligatorio.';
    } else if (password.length < 6) {
      errors.password = 'Debe tener al menos 6 caracteres.';
    }

    if (Object.keys(errors).length > 0) return [errors, undefined];

    return [
      undefined,
      new CreateUserDto(
        nombre.trim(),
        email.toLowerCase().trim(),
        rol.toUpperCase().trim(),
        password
      ),
    ];
  }
}
