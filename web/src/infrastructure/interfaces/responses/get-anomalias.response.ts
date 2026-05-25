export interface GetAnomaliasResponse {
  status: string;
  message: string;
  data: Datum[];
  pagination: Pagination;
}

export interface Datum {
  id_acceso_biometrico: number;
  fecha_hora: Date;
  estado: string;
  dispositivo_autorizado: DispositivoAutorizado;
  usuario: Usuario;
}

export interface DispositivoAutorizado {
  dispositivo_id: string;
  nombre_dispositivo: string;
}

export interface Usuario {
  id_usuario: number;
  nombre: string;
  rol: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  next: string;
  prev: string;
}
