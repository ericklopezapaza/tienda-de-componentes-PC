import { Injectable, inject, signal, computed } from '@angular/core';
import { Producto } from '../modelos/producto';
import { pedidos as Pedido } from '../modelos/pedidos';
import { PRODUCTOS } from './datos/productos';

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class TiendaService {

  // Datos
  pedidosRegistrados = signal<Pedido[]>([]);
  productos: Producto[] = [...PRODUCTOS];
  carrito = signal<ItemCarrito[]>([]);
  actualizacionCatalogo = signal(0);

  // Totales del carrito
  cantidadCarrito = computed(() =>
    this.carrito().reduce((total, item) => total + item.cantidad, 0)
  );
  totalCarrito = computed(() =>
    this.carrito().reduce(
      (total, item) => total + item.producto.precio * item.cantidad,
      0
    )
  );

  // Actualizar el stock de un producto
  private modificarStock(codigo: number, cambio: number): void {
    this.productos = this.productos.map(producto =>
      producto.codigo === codigo
        ? { ...producto, stock: producto.stock + cambio }
        : producto
    );
    const productoActualizado = this.productos.find(
      producto => producto.codigo === codigo
    );
    if (!productoActualizado) return;
    this.carrito.update(items =>
      items.map(item =>
        item.producto.codigo === codigo
          ? { ...item, producto: productoActualizado }
          : item
      )
    );
    this.actualizacionCatalogo.update(valor => valor + 1);
  }

  // Devolver el stock de un pedido cancelado
  devolverExistencias(detalles: {
    codigodetalle: number;
    nombreProducto: string;
    precioUnitario: number;
    cantidad: number;
    subtotal: number;
  }[]): void {
    detalles.forEach(detalle => {
      const producto = this.productos.find(
        producto => producto.nombre === detalle.nombreProducto
      );

      if (producto) {
        this.modificarStock(producto.codigo, detalle.cantidad);
      }
    });
  }

  // Agregar un producto al carrito
  agregarCompra(producto: Producto): void {
    const productoCatalogo = this.productos.find(
      item => item.codigo === producto.codigo
    );
    if (!productoCatalogo || productoCatalogo.stock <= 0) return;
    this.modificarStock(producto.codigo, -1);
    const productoActualizado = this.productos.find(
      item => item.codigo === producto.codigo
    );
    if (!productoActualizado) return;
    const existente = this.carrito().find(
      item => item.producto.codigo === producto.codigo
    );
    if (existente) {
      this.carrito.update(items =>
        items.map(item =>
          item.producto.codigo === producto.codigo
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );
    } else {
      this.carrito.update(items => [
        ...items,
        { producto: productoActualizado, cantidad: 1 }
      ]);
    }
  }

  // Aumentar la cantidad de un producto
  aumentarCantidad(codigo: number): void {
    const producto = this.productos.find(
      item => item.codigo === codigo
    );
    if (!producto || producto.stock <= 0) return;
    this.modificarStock(codigo, -1);
    this.carrito.update(items =>
      items.map(item =>
        item.producto.codigo === codigo
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    );
  }

  // Reducir la cantidad de un producto
  reducirCantidad(codigo: number): void {
    const item = this.carrito().find(
      producto => producto.producto.codigo === codigo
    );
    if (!item) return;
    this.modificarStock(codigo, 1);
    this.carrito.update(items =>
      items
        .map(producto =>
          producto.producto.codigo === codigo
            ? { ...producto, cantidad: producto.cantidad - 1 }
            : producto
        )
        .filter(producto => producto.cantidad > 0)
    );
  }

  // Quitar un producto del carrito
  quitarProducto(codigo: number): void {
    const item = this.carrito().find(
      producto => producto.producto.codigo === codigo
    );
    if (!item) return;
    this.modificarStock(codigo, item.cantidad);
    this.carrito.update(items =>
      items.filter(item => item.producto.codigo !== codigo)
    );
  }

  // Vaciar el carrito y devolver las existencias
  vaciarCarrito(): void {
    this.carrito().forEach(item => {
      this.modificarStock(item.producto.codigo, item.cantidad);
    });
    this.carrito.set([]);
  }
  limpiarCarrito(): void {
    this.carrito.set([]);
  }
}
