export interface CategoriesResponse {
    status:     string;
    message:    string;
    data:       Datum[];
    pagination: Pagination;
}

export interface Datum {
    id_categoria: number;
    nombre:       string;
    descripcion:  string;
}

export interface Pagination {
    page:  number;
    limit: number;
    total: number;
    next:  string;
    prev:  null;
}
