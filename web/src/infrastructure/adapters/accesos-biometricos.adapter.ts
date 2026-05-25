import type { GetAccesosBiometricosDatum } from '@/infrastructure/interfaces/responses/get-accesos-biometricos.ts';

export interface DataGraficoAcceso {
  dispositivo: string;
  Permitidos: number;
  Denegados: number;
}

export const transformarDatosAccesos = (
  apiData: GetAccesosBiometricosDatum[]
): DataGraficoAcceso[] => {
  const agrupado: Record<string, { Permitidos: number; Denegados: number }> =
    {};

  apiData.forEach((item) => {
    const nombreDispositivo = item.dispositivo_autorizado.nombre_dispositivo;

    if (!agrupado[nombreDispositivo]) {
      agrupado[nombreDispositivo] = { Permitidos: 0, Denegados: 0 };
    }

    if (item.estado === 'PERMITIDO') {
      agrupado[nombreDispositivo].Permitidos += 1;
    } else if (item.estado === 'DENEGADO') {
      agrupado[nombreDispositivo].Denegados += 1;
    }
  });

  return Object.keys(agrupado).map((key) => ({
    dispositivo: key,
    Permitidos: agrupado[key].Permitidos,
    Denegados: agrupado[key].Denegados,
  }));
};
