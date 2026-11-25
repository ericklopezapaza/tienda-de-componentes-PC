
import { Component, inject, signal, computed } from '@angular/core';
import { DatePipe, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PedidosService } from '../../servicios/pedidos';

@Component({
  imports: [DatePipe, CurrencyPipe, RouterLink, TitleCasePipe],
  selector: 'app-historial-pedidos',
  styleUrl: './historial-pedidos.component.css',
  templateUrl: './historial-pedidos.component.html',
})
export class HistorialPedidosComponent {

  private pedidosService = inject(PedidosService);
  
  pedidos = this.pedidosService.pedidosRegistrados;
  filtroEstado = signal('todos');

  // Mostrar los pedidos según el estado seleccionado
  pedidosFiltrados = computed(() => {
    const estado = this.filtroEstado();
    if (estado === 'todos') {
      return this.pedidos();
    }
    return this.pedidos().filter(pedido => pedido.estado === estado);
  });

}
