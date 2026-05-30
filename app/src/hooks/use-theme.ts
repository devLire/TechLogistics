/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import type { ThemeColor } from '@/constants/theme';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface UseThemeProps {
  light?: string;
  dark?: string;
}

// FIRMA 1: Si pasas argumentos (como excepciones o un nombre de color), el retorno es fijado como string.
export function useTheme(props?: UseThemeProps, colorName?: ThemeColor): string;

// FIRMA 2: Si no pasas argumentos, te devuelve todo el sub-objeto del tema actual (light o dark).
export function useTheme(): typeof Colors.light;

// IMPLEMENTACIÓN REAL DE LA FUNCIÓN
export function useTheme(props?: UseThemeProps, colorName?: ThemeColor) {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? 'dark' : 'light';

  // 1. Si pasaste una excepción en caliente para el tema activo, úsala
  const colorFromProps = props?.[theme];
  if (colorFromProps) {
    return colorFromProps;
  }

  // 2. Si pasaste un nombre de color, devuélvelo desde tus constantes
  if (colorName) {
    return Colors[theme][colorName];
  }

  // 3. Si no hay argumentos, devuelve todo el objeto
  return Colors[theme];
}
