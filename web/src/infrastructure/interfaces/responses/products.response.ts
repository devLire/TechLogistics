export interface ProductsResponse {
    status:     string;
    message:    string;
    data:       Datum[];
    pagination: Pagination;
}

export interface Datum {
    id_producto:   number;
    nombre:        string;
    descripcion:   string;
    precio_venta:  string;
    stock_actual:  number;
    stock_minimo:  number;
    codigo_barras: string;
    categoria:     Categoria;
    proveedor:     Proveedor;
}

export interface Categoria {
    id_categoria: number;
    nombre:       string;
}

export interface Proveedor {
    id_proveedor:   number;
    nombre_empresa: string;
}

export interface Pagination {
    page:  number;
    limit: number;
    total: number;
    next:  string;
    prev:  null;
}
