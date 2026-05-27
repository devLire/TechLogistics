import type { ErrorsDetails } from '@/infrastructure/interfaces/error-details.interfaces.ts';

export interface GetAccesosBiometricosResponse {
  status: string;
  message: string;
  data: GetAccesosBiometricosDatum[];
  errors: ErrorsDetails[];
  pagination: Pagination;
}

export interface GetAccesosBiometricosDatum {
  id_acceso_biometrico: number;
  usuario: Usuario;
  dispositivo_autorizado: DispositivoAutorizado;
  fecha_hora: Date;
  estado: Estado;
}

export interface DispositivoAutorizado {
  id_dispositivo_autorizado: number;
  nombre_dispositivo: string;
}

export type Estado = 'DENEGADO' | 'PERMITIDO';

export interface Usuario {
  id_usuario: number;
  nombre: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  next: string;
  prev: string;
}
