
import { Component, signal, computed, inject } from '@angular/core';
import { Producto } from '../../modelos/producto';
import { TarjetaProducto } from '../../components/tarjeta-producto/tarjeta-producto';
import { TiendaService } from '../../servicios/tienda';
import { RouteConfigLoadEnd, RouterLink } from '@angular/router';

@Component({
  imports: [TarjetaProducto, RouterLink],
  selector: 'app-productos',
  styleUrl: './productos.component.css',
  templateUrl: './productos.component.html',
})
export class ProductosComponent {

  // Acceder al servicio compartido de la tienda
  private tienda = inject(TiendaService);
  get productos(): Producto[] {
    return this.tienda.productos;
  }

  carrito = this.tienda.carrito;
  cantidadCarrito = this.tienda.cantidadCarrito;
  totalCarrito = this.tienda.totalCarrito;
  carritoAbierto = signal(false);

  // CARRUSEL DE PRODUCTOS
  posiciones = signal<Record<string, number>>({});

  moverCarrusel(
    categoria: string,
    direccion: 'izquierda' | 'derecha'
  ): void {

    const contenedor = document.getElementById(
      'carrusel-' + categoria
    );

    if (!contenedor) return;

    const desplazamiento = contenedor.clientWidth * 0.8;

    contenedor.scrollBy({
      left: direccion === 'derecha'
        ? desplazamiento
        : -desplazamiento,
      behavior: 'smooth'
    });

    const actual = this.posiciones()[categoria] || 0;

    this.posiciones.update(posiciones => ({
      ...posiciones,
      [categoria]: Math.max(
        0,
        actual + (direccion === 'derecha' ? 1 : -1)
      )
    }));
  }

  // BUSCADOR
  busqueda = signal('');
  categoriasProductos = computed(() => {
    this.tienda.actualizacionCatalogo();

    const termino = this.busqueda().trim().toLowerCase();

    const filtrados = this.productos.filter(producto => {

      return (
        producto.nombre.toLowerCase().includes(termino) ||
        producto.descripcion.toLowerCase().includes(termino) ||
        producto.categoria.toLowerCase().includes(termino)
      );
    });

    const categorias = [...new Set(
      filtrados.map(producto => producto.categoria)
    )];

    return categorias.map(categoria => ({
      nombre: categoria,
      productos: filtrados.filter(
        producto => producto.categoria === categoria
      )
    }));

  });

  // ACTUALIZAR BUSCADOR
  buscarProducto(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.busqueda.set(valor);
  }

  // AGREGAR PRODUCTOS AL CARRITO
  agregarCompra(producto: Producto): void {
    this.tienda.agregarCompra(producto);
  }

  // AUMENTAR CANTIDAD

  aumentarCantidad(codigo: number): void {
    this.tienda.aumentarCantidad(codigo);
  }

  // REDUCIR CANTIDAD

  reducirCantidad(codigo: number): void {
    this.tienda.reducirCantidad(codigo);
  }

  // ELIMINAR PRODUCTO COMPLETO

  quitarProducto(codigo: number): void {
    this.tienda.quitarProducto(codigo);
  }

  // VACIAR CARRITO

  vaciarCarrito(): void {
    this.tienda.vaciarCarrito();
  }

  // ABRIR Y CERRAR CARRITO

  abrirCarrito(): void {
    this.carritoAbierto.set(true);
  }

  cerrarCarrito(): void {
    this.carritoAbierto.set(false);
  }

}
