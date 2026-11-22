import { DetallePedido } from "./DetallePedido";

export interface pedidos {
    codigo: number;
    fecha: Date;
    estado: "pendiente" | "cancelado";
    total: number;
    detdetalles: DetallePedido[];
}