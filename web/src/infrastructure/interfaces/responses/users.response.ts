export interface UsersResponse {
    status:     string;
    message:    string;
    data:       Datum[];
    pagination: Pagination;
}

export interface Datum {
    id_usuario: number;
    nombre:     string;
    email:      string;
    rol:        Rol;
}

export enum Rol {
    Administrador = "ADMINISTRADOR",
    Cajero = "CAJERO",
    Inventario = "INVENTARIO",
}

export interface Pagination {
    page:  number;
    limit: number;
    total: number;
    next:  string;
    prev:  null;
}
