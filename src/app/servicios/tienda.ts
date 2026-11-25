import { Injectable, inject, signal, computed } from '@angular/core';
import { Producto } from '../modelos/producto';
import { pedidos as Pedido } from '../modelos/pedidos';
import { PRODUCTOS } from './datos/productos';
import { IndexedDb } from './indexed-db';

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class TiendaService {

  // Conexion con IndexedDB
  private indexedDb = inject(IndexedDb);

  // Datos
  pedidosRegistrados = signal<Pedido[]>([]);
  productos: Producto[] = [...PRODUCTOS];
  carrito = signal<ItemCarrito[]>([]);
  actualizacionCatalogo = signal(0);
  cargando = signal(true);

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

  constructor() {
    this.inicializar();
  }

  // Cargar el inventario y el carrito guardados
  private async inicializar(): Promise<void> {
    try {
      const productosGuardados = await this.indexedDb.obtenerProductos();

      if (productosGuardados.length > 0) {
        this.productos = productosGuardados;
      } else {
        await this.indexedDb.guardarProductos(this.productos);
      }

      this.actualizacionCatalogo.update(valor => valor + 1);

      const carritoGuardado = await this.indexedDb.obtenerCarrito();

      const itemsCarrito = carritoGuardado
        .map(item => {
          const producto = this.productos.find(
            producto => producto.codigo === item.producto.codigo
          );

          return producto ? { ...item, producto } : null;
        })
        .filter((item): item is ItemCarrito => item !== null);

      this.carrito.set(itemsCarrito);
    } catch (error) {
      console.error('Error al cargar los datos de la tienda:', error);
    } finally {
      this.cargando.set(false);
    }
  }

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
    // Guardar los cambios del inventario en IndexedDB
    this.indexedDb.guardarProductos(this.productos);
  }

  // Guardar los cambios del carrito en IndexedDB
  private guardarCarrito(): void {
    this.indexedDb.guardarCarrito(this.carrito());
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
    this.guardarCarrito();
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
    this.guardarCarrito();
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
    this.guardarCarrito();
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
    this.guardarCarrito();
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
    this.guardarCarrito();
  }

  // Vaciar el carrito y devolver las existencias
  vaciarCarrito(): void {
    this.carrito().forEach(item => {
      this.modificarStock(item.producto.codigo, item.cantidad);
    });
    this.carrito.set([]);
    this.guardarCarrito();
  }

  // Limpiar el carrito después de registrar un pedido
  limpiarCarrito(): void {
    this.carrito.set([]);
    this.guardarCarrito();
  }
}
