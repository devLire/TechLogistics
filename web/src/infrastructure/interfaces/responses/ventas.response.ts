export interface VentasResponse {
    status:     string;
    message:    string;
    data:       Datum[];
    pagination: Pagination;
}

export interface Datum {
    id_venta:    number;
    id_usuario:  number;
    fecha_hora:  Date;
    total:       string;
    metodo_pago: MetodoPago;
    usuario:     Usuario;
    detalles:    Detalle[];
}

export interface Detalle {
    id_detalle_venta_producto: number;
    id_venta:                  number;
    id_producto:               number;
    cantidad:                  number;
    precio_unitario:           string;
    subtotal:                  string;
}

export enum MetodoPago {
    Efectivo = "Efectivo",
    Tarjeta = "Tarjeta",
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
