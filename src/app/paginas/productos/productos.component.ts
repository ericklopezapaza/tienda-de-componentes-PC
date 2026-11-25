
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

  buscarProducto(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.busqueda.set(valor);
  }

  agregarCompra(producto: Producto): void {
    this.tienda.agregarCompra(producto);
  }

  aumentarCantidad(codigo: number): void {
    this.tienda.aumentarCantidad(codigo);
  }

  reducirCantidad(codigo: number): void {
    this.tienda.reducirCantidad(codigo);
  }

  quitarProducto(codigo: number): void {
    this.tienda.quitarProducto(codigo);
  }

  vaciarCarrito(): void {
    this.tienda.vaciarCarrito();
  }

  abrirCarrito(): void {
    this.carritoAbierto.set(true);
  }
  cerrarCarrito(): void {
    this.carritoAbierto.set(false);
  }

}
