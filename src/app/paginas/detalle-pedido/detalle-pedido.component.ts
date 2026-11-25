import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PedidosService } from '../../servicios/pedidos';
import { pedidos as Pedido } from '../../modelos/pedidos';
import { DatePipe, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { TiendaService } from '../../servicios/tienda';

@Component({
  selector: 'app-detalle-pedido',
  imports: [DatePipe, CurrencyPipe, TitleCasePipe],
  templateUrl: './detalle-pedido.component.html',
  styleUrl: './detalle-pedido.component.css'
})
export class DetallePedidoComponent {

  private  readonly route = inject(ActivatedRoute);
  private readonly pedidosService = inject(PedidosService);
  private readonly tiendaService = inject(TiendaService);

  cancelando = signal(false);
  pedido = signal<Pedido | null>(null);

  
  constructor() {
    const codigo = Number(this.route.snapshot.paramMap.get('codigo'));
    this.pedidosService.cargarPedidos().then(() => {
      const pedidoEncontrado = this.pedidosService.pedidosRegistrados()
        .find(p => p.codigo === codigo);
      this.pedido.set(pedidoEncontrado ?? null);
    });
  }

  // Cancela el pedido y devuelve las existencias al catálogo.
  async cancelarPedido(): Promise<void> {
    const pedidoActual = this.pedido();
    // Evita cancelar un pedido inexistente o ya cancelado.
    if (!pedidoActual || pedidoActual.estado === 'cancelado' || this.cancelando()) {
      return;
    }
    this.cancelando.set(true);
    try {
      // Actualiza el estado del pedido y lo guarda en IndexedDB.
      const pedidoCancelado: Pedido = {
        ...pedidoActual,
        estado: 'cancelado'
      };
      await this.pedidosService.actualizarPedido(pedidoCancelado);
      this.tiendaService.devolverExistencias(pedidoActual.detalles);
      this.pedido.set(pedidoCancelado);
    } finally {
      this.cancelando.set(false);
    }
  }
}
