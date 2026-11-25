
import { Component, inject, computed, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { TiendaService } from '../../servicios/tienda';
import { PedidosService } from '../../servicios/pedidos';
import { DetallePedido } from '../../modelos/DetallePedido';
import { pedidos as Pedido } from '../../modelos/pedidos';


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
  private pedidosService = inject(PedidosService);

  mensajeExito = signal('');
  mensajeError = signal('');

  // Formulario con los datos necesarios del cliente
  formularioPedido = this.fb.group({
    nombreCliente: ['', [Validators.required, Validators.minLength(3)]],
    ci: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9-]+$/)]],
    telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
    direccion: ['', Validators.required]
  });

  // Obtener los productos que el cliente agregó al carrito
  carrito = this.tienda.carrito;

  // Calcular el total de unidades del pedido
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

  //registro del pedido
  async registrarPedido(): Promise<void> {
    this.mensajeExito.set('');
    this.mensajeError.set('');

    if (this.formularioPedido.invalid) {
      this.formularioPedido.markAllAsTouched();
      return;
    }
    if (this.carrito().length === 0) {
      this.mensajeError.set('Debes agregar productos antes de registrar el pedido.');
      return;
    }

    const nuevoPedido: Pedido = {
      codigo: Date.now(),
      fecha: new Date(),
      estado: 'pendiente',
      nombreCliente: this.formularioPedido.value.nombreCliente ?? '',
      ci: this.formularioPedido.value.ci ?? '',
      telefono: this.formularioPedido.value.telefono ?? '',
      direccion: this.formularioPedido.value.direccion ?? '',
      total: this.totalPedido(),
      detalles: this.obtenerDetalles()
    };

   try {
    // Guardar el pedido en IndexedDB mediante el servicio.
    await this.pedidosService.registrarPedido(nuevoPedido);
    this.formularioPedido.reset();
    this.tienda.vaciarCarrito();
    this.mensajeExito.set(
      'El pedido se registró correctamente. Revisa tus pedidos en la sección Mis pedidos.'
    );
  } catch (error) {
    console.error('Error al registrar el pedido:', error);
    this.mensajeError.set('No se pudo registrar el pedido. Inténtalo nuevamente.');
  }
  }

}
