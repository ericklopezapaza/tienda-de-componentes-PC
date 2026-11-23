
import { Component, inject, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

import { TiendaService } from '../../servicios/tienda';
import { DetallePedido } from '../../modelos/DetallePedido';

@Component({
  imports: [ReactiveFormsModule, CurrencyPipe],
  selector: 'app-crear-pedido',
  styleUrl: './crear-pedido.component.css',
  templateUrl: './crear-pedido.component.html',
})
export class CrearPedidoComponent {

  // Herramienta de Angular para construir formularios reactivos
  private fb = inject(FormBuilder);
  private tienda = inject(TiendaService);

  formularioPedido = this.fb.group({
    nombreCliente: ['', [Validators.required, Validators.minLength(3)]],
    ci: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{7,8}$/)]],
    direccion: ['', Validators.required]
  });

  // Obtener los productos que el cliente agregó al carrito
  carrito = this.tienda.carrito;

  cantidadTotal = computed(() =>
    this.carrito().reduce(
      (total, item) => total + item.cantidad,
      0
    )
  );


  totalPedido = this.tienda.totalCarrito;

  // Convertir los productos del carrito al formato del detalle del pedido
  obtenerDetalles(): DetallePedido[] {
    return this.carrito().map(item => ({
      codigodetalle: item.producto.codigo,
      nombreProducto: item.producto.nombre,
      precioUnitario: item.producto.precio,
      cantidad: item.cantidad,
      subtotal: item.producto.precio * item.cantidad
    }));
  }

}
