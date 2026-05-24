import jwt from 'jsonwebtoken';

const JWT_SEED = process.env.JWT_SEED || 'FaltaSemilla';

export class JwtAdapter {
  // Genera el token firmando el ID del usuario
  static async generateToken(payload: any, duration: string = '2h') {
    return new Promise((resolve) => {
      jwt.sign(payload, JWT_SEED, { expiresIn: duration as any }, (err, token) => {
        if (err) return resolve(null);
        resolve(token);
      });
    });
  }

  // Verifica que el token sea válido y no haya expirado
  static async validateToken<T>(token: string): Promise<T | null> {
    return new Promise((resolve) => {
      jwt.verify(token, JWT_SEED, (err, decoded) => {
        if (err) return resolve(null);
        resolve(decoded as T);
      });
    });
  }
}
