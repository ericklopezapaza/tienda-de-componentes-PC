
import { Injectable, inject, signal } from '@angular/core';
import { pedidos as Pedido } from '../modelos/pedidos';
import { IndexedDb } from './indexed-db';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  private indexedDb = inject(IndexedDb);
  pedidosRegistrados = signal<Pedido[]>([]);

  constructor() {
    this.cargarPedidos();
  }

  // cargar los pedidos desde IndexedDB al iniciar el servicio
  async cargarPedidos(): Promise<void> {
    try {
      const pedidos = await this.indexedDb.obtenerPedidos();
      this.pedidosRegistrados.set(pedidos);

    } catch (error) {
      console.error('Error al cargar los pedidos:', error);
    }
  }

  // REGISTRAR UN NUEVO PEDIDO
  async registrarPedido(pedido: Pedido): Promise<void> {
    await this.indexedDb.guardarPedido(pedido);
    this.pedidosRegistrados.update(pedidos => [
      ...pedidos,
      pedido
    ]);
  }

  // actualizar un pedido existente
  async actualizarPedido(pedido: Pedido): Promise<void> {
    await this.indexedDb.actualizarPedido(pedido);
    this.pedidosRegistrados.update(pedidos =>
      pedidos.map(item =>
        item.codigo === pedido.codigo ? pedido : item
      )
    );
  }

}
