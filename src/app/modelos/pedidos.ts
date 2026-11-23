import { DetallePedido } from "./DetallePedido";

export interface pedidos {
    codigo: number;
    fecha: Date;
    estado: "pendiente" | "cancelado";
    nombreCliente: string;
    ci: string;
    telefono: string;
    direccion: string;
    total: number;
    detalles: DetallePedido[];
}
