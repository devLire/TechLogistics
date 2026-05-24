export interface ProveedoresResponse {
    status:     string;
    message:    string;
    data:       Datum[];
    pagination: Pagination;
}

export interface Datum {
    id_proveedor:   number;
    nombre_empresa: string;
    contacto:       string;
    telefono:       string;
}

export interface Pagination {
    page:  number;
    limit: number;
    total: number;
    next:  string;
    prev:  null;
}
