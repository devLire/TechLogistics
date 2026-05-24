export interface IngresosResponse {
    status:     string;
    message:    string;
    data:       Datum[];
    pagination: Pagination;
}

export interface Datum {
    id_inventario:      number;
    id_producto:        number;
    id_usuario:         number;
    cantidad_ingresada: number;
    fecha_ingreso:      Date;
    producto:           Producto;
    usuario:            Usuario;
}

export interface Producto {
    id_producto: number;
    nombre:      string;
    proveedor:   Proveedor;
}

export interface Proveedor {
    nombre_empresa: string;
}

export interface Usuario {
    id_usuario: number;
    nombre:     string;
}

export interface Pagination {
    page:  number;
    limit: number;
    total: number;
    next:  string;
    prev:  null;
}
