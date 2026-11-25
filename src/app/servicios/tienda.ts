
import { Injectable, signal, computed } from '@angular/core';

import { Producto } from '../modelos/producto';
import { pedidos as Pedido } from '../modelos/pedidos';
import { PRODUCTOS } from './datos/productos';

// Elementos que forman parte del carrito
export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class TiendaService {

  // Pedidos registrados
  pedidosRegistrados = signal<Pedido[]>([]);

  // Catálogo de productos
  productos: Producto[] = [...PRODUCTOS];

  // Carrito de compras
  carrito = signal<ItemCarrito[]>([]);

  // Notifica cambios en el catálogo
  actualizacionCatalogo = signal(0);

  // Cantidad total de unidades en el carrito
  cantidadCarrito = computed(() =>
    this.carrito().reduce(
      (total, item) => total + item.cantidad,
      0
    )
  );

  // Importe total del carrito
  totalCarrito = computed(() =>
    this.carrito().reduce(
      (total, item) => total + item.producto.precio * item.cantidad,
      0
    )
  );

  // Modificar el stock del catálogo
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

    // Actualizar la referencia del producto dentro del carrito
    this.carrito.update(items =>
      items.map(item =>
        item.producto.codigo === codigo
          ? { ...item, producto: productoActualizado }
          : item
      )
    );

    // Notificar actualización del catálogo
    this.actualizacionCatalogo.update(valor => valor + 1);
  }

  // Devolver existencias de un pedido cancelado
  devolverExistencias(
    detalles: {
      codigodetalle: number;
      nombreProducto: string;
      precioUnitario: number;
      cantidad: number;
      subtotal: number;
    }[]
  ): void {

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

    // Verificar disponibilidad
    if (!productoCatalogo || productoCatalogo.stock <= 0) return;

    // Descontar una unidad del inventario
    this.modificarStock(producto.codigo, -1);

    const productoActualizado = this.productos.find(
      item => item.codigo === producto.codigo
    );

    if (!productoActualizado) return;

    // Comprobar si el producto ya existe en el carrito
    const existente = this.carrito().find(
      item => item.producto.codigo === producto.codigo
    );

    if (existente) {

      // Aumentar la cantidad del producto existente
      this.carrito.update(items =>
        items.map(item =>
          item.producto.codigo === producto.codigo
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );

    } else {

      // Agregar un nuevo producto al carrito
      this.carrito.update(items => [
        ...items,
        {
          producto: productoActualizado,
          cantidad: 1
        }
      ]);
    }
  }

  // Aumentar la cantidad de un producto
  aumentarCantidad(codigo: number): void {

    const producto = this.productos.find(
      item => item.codigo === codigo
    );

    // Verificar que exista stock disponible
    if (!producto || producto.stock <= 0) return;

    // Descontar una unidad del inventario
    this.modificarStock(codigo, -1);

    // Aumentar la cantidad en el carrito
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

    // Devolver una unidad al inventario
    this.modificarStock(codigo, 1);

    // Reducir la cantidad o eliminar el producto si llega a cero
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

  // Eliminar un producto completamente del carrito
  quitarProducto(codigo: number): void {

    const item = this.carrito().find(
      producto => producto.producto.codigo === codigo
    );

    if (!item) return;

    // Devolver todas las unidades al inventario
    this.modificarStock(codigo, item.cantidad);

    // Eliminar el producto del carrito
    this.carrito.update(items =>
      items.filter(item => item.producto.codigo !== codigo)
    );
  }

  // Vaciar completamente el carrito
  vaciarCarrito(): void {

    // Devolver las existencias de todos los productos
    this.carrito().forEach(item => {
      this.modificarStock(item.producto.codigo, item.cantidad);
    });

    // Limpiar el carrito
    this.carrito.set([]);
  }

}
