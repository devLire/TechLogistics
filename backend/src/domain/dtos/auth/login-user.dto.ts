import { regularExps } from '../../../config/regular-exp';

export class LoginUserDto {
  private constructor(
    public readonly email: string,
    public readonly password: string
  ) {}

  static create(props: {
    [key: string]: string;
  }): [{ [key: string]: string }?, LoginUserDto?] {
    const { email, password } = props;
    const errors: { [key: string]: string } = {};

    if (!email || !regularExps.email.test(email))
      errors.email = 'El email no es válido';

    if (!password) {
      errors.password = 'El campo "password" es obligatorio.';
    } else if (password.length < 6) {
      errors.password = 'Debe tener al menos 6 caracteres.';
    }

    if (Object.keys(errors).length > 0) return [errors, undefined];

    return [undefined, new LoginUserDto(email.toLowerCase().trim(), password)];
  }
}
