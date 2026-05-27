export function formatErrors(
  errors: any
): Array<{ error: string; mensaje: string }> {
  // Si no hay errores (null, undefined, etc.), devuelve un array vacío
  if (!errors) return [];

  // Si es una instancia de un Error nativo de JavaScript
  if (errors instanceof Error) {
    return [{ error: 'server', mensaje: errors.message }];
  }

  // Si es una cadena de texto (string)
  if (typeof errors === 'string') {
    return [{ error: 'error', mensaje: errors }];
  }

  // Si ya es un array de objetos, intenta normalizar cada elemento
  if (Array.isArray(errors)) {
    return errors.map((e: any) => {
      // Si el elemento ya tiene la estructura deseada, lo deja igual
      if (e && typeof e === 'object' && 'error' in e && 'mensaje' in e)
        return e;
      // Si el elemento es un string, lo envuelve en la estructura
      if (typeof e === 'string') return { error: 'error', mensaje: e };
      // En cualquier otro caso, fuerza la conversión a string y JSON
      return { error: String(e), mensaje: JSON.stringify(e) };
    });
  }

  // Si es un objeto que mapea propiedades a sus respectivos mensajes (ej: errores de formulario)
  if (typeof errors === 'object') {
    return Object.entries(errors).map(([key, val]) => ({
      error: String(key),
      mensaje: typeof val === 'string' ? val : JSON.stringify(val),
    }));
  }

  // Caso de respaldo (fallback) por si llega un tipo de dato inesperado
  return [{ error: 'error', mensaje: String(errors) }];
}
